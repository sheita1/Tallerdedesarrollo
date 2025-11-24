"use strict";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/configDb.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js"; // ✅ usa tu esquema real

const router = Router();

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("🧹 [DELETE] Solicitud para eliminar imagen ID:", id);

  const repo = AppDataSource.getRepository("PatrimonioImagen");

  try {
    const imagen = await repo.findOneBy({ id });
    console.log("🔍 Imagen encontrada:", imagen);

    if (!imagen) {
      console.warn("⚠️ Imagen no encontrada en la base de datos");
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const rutaAbsoluta = path.join(process.cwd(), "uploads/patrimonios", imagen.ruta);
    console.log("📁 Ruta física:", rutaAbsoluta);

    if (fs.existsSync(rutaAbsoluta)) {
      fs.unlinkSync(rutaAbsoluta);
      console.log("🗑️ Archivo eliminado");
    } else {
      console.warn("⚠️ Archivo físico no encontrado");
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
