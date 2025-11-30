"use strict";
import { Router } from "express";
import upload from "../middlewares/uploadConfig.js";
import {
  deletePatrimonio,
  getPatrimonio,
  getPatrimonios,
  updatePatrimonio,
  createPatrimonio,
  getPatrimoniosPublicos,
  getDetallePatrimonio,
  subirImagenPatrimonio,
} from "../controllers/patrimonio.controller.js";

const router = Router();

// CRUD principal
router
  .get("/", getPatrimonios)                     // GET /api/patrimonios/
  .get("/detail", getPatrimonio)                // GET /api/patrimonios/detail?id=3
  .patch("/detail", updatePatrimonio)           // PATCH /api/patrimonios/detail
  .delete("/detail", deletePatrimonio)          // DELETE /api/patrimonios/detail
  .post("/", createPatrimonio);                 // POST /api/patrimonios/

// Subida de imágenes
router
  .post("/imagen/:id", upload.single("imagen"), (req, res, next) => {
    console.log("📥 [POST] Subida de imagen para patrimonio ID:", req.params.id);
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo" });
    }
    subirImagenPatrimonio(req, res, next);
  })
  .post("/imagenes/:id", upload.single("imagen"), (req, res, next) => {
    console.log("📥 [POST] Subida de imagen (plural) para patrimonio ID:", req.params.id);
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo" });
    }
    subirImagenPatrimonio(req, res, next);
  });

// Nueva ruta: obtener imágenes de un patrimonio
router.get("/imagenes/patrimonio/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Aquí deberías consultar BD o carpeta uploads
    // Ejemplo mínimo:
    // const imagenes = await ImagenModel.findAll({ where: { patrimonioId: id } });
    // if (!imagenes.length) return res.status(404).json({ message: "No se encontraron imágenes" });

    return res.json({
      status: "Success",
      message: `Imágenes del patrimonio ${id}`,
      data: [] // reemplaza con tu lógica real
    });
  } catch (err) {
    return res.status(500).json({ message: "Error interno", error: err.message });
  }
});

// Rutas públicas
router
  .get("/public", getPatrimoniosPublicos)       // GET /api/patrimonios/public
  .get("/detalle", getDetallePatrimonio);       // GET /api/patrimonios/detalle

export default router;
