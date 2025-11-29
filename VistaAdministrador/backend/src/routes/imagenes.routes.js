"use strict";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/configDb.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js";

const router = Router();

/**
 * ✅ Obtener imagen por ID con logs detallados
 */
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("📥 [GET] Solicitud para obtener imagen ID:", id);

  const repo = AppDataSource.getRepository(PatrimonioImagen);

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

    // Construir ruta física
    const rutaAbsoluta = path.join(process.cwd(), "uploads", imagen.ruta);
    console.log("📁 Ruta física que intenta servir:", rutaAbsoluta);

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
