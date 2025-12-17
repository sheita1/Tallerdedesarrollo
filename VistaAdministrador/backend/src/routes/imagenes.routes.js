"use strict";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/configDb.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js";
import { uploader } from "../middlewares/uploadConfig.js";
import { subirImagenPatrimonio } from "../controllers/patrimonio.controller.js";

const router = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads";

// ✅ SUBIR IMAGEN
router.post("/:id", uploader.single("imagen"), (req, res, next) => {
  console.log("📥 [POST IMAGENES] Subida de imagen");
  if (!req.file) {
    return res.status(400).json({ message: "No se recibió archivo" });
  }
  subirImagenPatrimonio(req, res, next);
});

// ✅ OBTENER TODAS LAS IMÁGENES DE UN PATRIMONIO
router.get("/patrimonio/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("📥 [GET] Listando imágenes del patrimonio:", id);

  try {
    const repo = AppDataSource.getRepository("PatrimonioImagen");

    const imagenes = await repo.find({
      where: { patrimonioId: id },
      order: { id: "ASC" }
    });

    console.log("🟢 Imágenes encontradas:", imagenes);

    return res.json({
      status: "Success",
      data: imagenes
    });

  } catch (error) {
    console.error("💥 Error obteniendo imágenes:", error);
    return res.status(500).json({ message: "Error interno al obtener imágenes" });
  }
});

// ✅ OBTENER UNA IMAGEN POR ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("📥 [GET] Obtener imagen ID:", id);

  const repo = AppDataSource.getRepository("PatrimonioImagen");

  try {
    const imagen = await repo.findOneBy({ id });

    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const rutaRelativa = imagen.ruta.replace("/uploads", "");
    const rutaAbsoluta = path.join(UPLOAD_DIR, rutaRelativa);

    if (!fs.existsSync(rutaAbsoluta)) {
      return res.status(404).json({ message: "Archivo físico no encontrado" });
    }

    return res.sendFile(rutaAbsoluta);
  } catch (error) {
    console.error("💥 Error interno:", error);
    res.status(500).json({ message: "Error interno al obtener imagen" });
  }
});

export default router;
