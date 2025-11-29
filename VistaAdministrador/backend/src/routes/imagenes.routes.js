"use strict";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/configDb.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js";

const router = Router();

/**
 * ✅ Obtener imagen por ID
 */
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("📥 [GET] Solicitud para obtener imagen ID:", id);

  const repo = AppDataSource.getRepository(PatrimonioImagen);

  try {
    const imagen = await repo.findOneBy({ id });

    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // 🔧 Corrección: ya incluye 'patrimonios/' en imagen.ruta
    const rutaAbsoluta = path.join(process.cwd(), "uploads", imagen.ruta);
    console.log("📁 Ruta física:", rutaAbsoluta);

    if (fs.existsSync(rutaAbsoluta)) {
      return res.sendFile(rutaAbsoluta);
    } else {
      return res.status(404).json({ message: "Archivo físico no encontrado" });
    }
  } catch (error) {
    console.error("💥 Error al obtener imagen:", error);
    res.status(500).json({ message: "Error interno al obtener imagen" });
  }
});

/**
 * 🗑️ Eliminar imagen por ID
 */
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("🧹 [DELETE] Solicitud para eliminar imagen ID:", id);

  const repo = AppDataSource.getRepository(PatrimonioImagen);

  try {
    const imagen = await repo.findOneBy({ id });

    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // 🔧 Corrección: ya incluye 'patrimonios/' en imagen.ruta
    const rutaAbsoluta = path.join(process.cwd(), "uploads", imagen.ruta);
    console.log("📁 Ruta física:", rutaAbsoluta);

    if (fs.existsSync(rutaAbsoluta)) {
      fs.unlinkSync(rutaAbsoluta);
      console.log("🗑️ Archivo eliminado");
    }

    await repo.delete(id);
    console.log("✅ Registro eliminado de la base de datos");

    res.status(200).json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("💥 Error interno al eliminar imagen:", error);
    res.status(500).json({ message: "Error interno al eliminar imagen" });
  }
});

export default router;
