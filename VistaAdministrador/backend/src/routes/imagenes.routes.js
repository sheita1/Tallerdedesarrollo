"use strict";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/configDb.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js";
// 🛑 IMPORTACIONES NECESARIAS 🛑
import { uploader } from "../middlewares/uploadConfig.js"; 
import { subirImagenPatrimonio } from "../controllers/patrimonio.controller.js"; 

const router = Router();

// 🚨 Obtener variable de entorno para consistencia
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads"; 

// 🛑 RUTA DE SUBIDA AGREGADA PARA CORREGIR EL CONFLICTO 🛑
// Captura POST /api/patrimonios/imagenes/:id
router.post("/:id", uploader.single("imagen"), (req, res, next) => {
    console.log("📥 [POST IMAGENES] Solicitud de subida de imagen capturada por imagenes.routes");
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo" });
    }
    // Llama al controlador que ya tiene la lógica de persistencia corregida
    subirImagenPatrimonio(req, res, next);
});


/**
 * ✅ Obtener imagen por ID con logs detallados
 */
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("📥 [GET] Solicitud para obtener imagen ID:", id);

  // Usamos el nombre de la entidad como string para robustez
  const repo = AppDataSource.getRepository("PatrimonioImagen"); 

  try {
    const imagen = await repo.findOneBy({ id });
    console.log("🔎 Resultado de la BD:", imagen);

    if (!imagen) {
      console.log("⚠️ No se encontró registro en BD para id:", id);
      return res.status(404).json({ message: "Imagen no encontrada en BD" });
    }

    // Mostrar campos del registro
    console.log("📊 Campos del registro:", {
      id: imagen.id,
      ruta: imagen.ruta,
      patrimonioId: imagen.patrimonioId,
    });

    // La ruta guardada es "/uploads/patrimonios/nombre.png"
    // Debemos usar path.join(process.cwd(), 'uploads') si estamos en index.js,
    // pero aquí necesitamos la ruta absoluta para fs.
    
    // Asumimos que la ruta guardada en DB (imagen.ruta: /uploads/patrimonios/...)
    // es la ruta que debemos usar si el middleware de express.static falla.
    // Extraemos la parte relativa para construir la ruta absoluta interna
    const rutaRelativa = imagen.ruta.replace('/uploads', '');
    const rutaAbsoluta = path.join(UPLOAD_DIR, rutaRelativa); 
    
    console.log("📁 Ruta física que intenta servir (ABSOLUTA):", rutaAbsoluta);

    // Verificar existencia del archivo
    const existeArchivo = fs.existsSync(rutaAbsoluta);
    console.log("🔍 ¿Existe archivo en carpeta uploads?:", existeArchivo);

    if (!existeArchivo) {
      console.log("⚠️ Archivo físico no encontrado en:", rutaAbsoluta);
      return res.status(404).json({ message: "Archivo físico no encontrado" });
    }

    console.log("✅ Enviando archivo al cliente:", rutaAbsoluta);
    return res.sendFile(rutaAbsoluta);
  } catch (error) {
    console.error("💥 Error interno al obtener imagen:", error);
    res.status(500).json({ message: "Error interno al obtener imagen" });
  }
});

export default router;