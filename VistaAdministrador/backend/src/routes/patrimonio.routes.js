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

router
  // CRUD principal
  .get("/", getPatrimonios)
  .get("/detail/", getPatrimonio)
  .patch("/detail/", updatePatrimonio)
  .delete("/detail/", deletePatrimonio)
  .post("/", createPatrimonio)

  // ✅ Subida de imagen con logs
  .post("/imagen/:id", upload.single("imagen"), (req, res, next) => {
    console.log("📥 [POST] Subida de imagen para patrimonio ID:", req.params.id);
    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Archivo recibido:", req.file);

    if (!req.file) {
      console.log("⚠️ No se recibió archivo en la petición");
      return res.status(400).json({ message: "No se recibió archivo" });
    }

    // Pasar al controlador real
    subirImagenPatrimonio(req, res, next);
  })
  .post("/imagenes/:id", upload.single("imagen"), (req, res, next) => {
    console.log("📥 [POST] Subida de imagen (plural) para patrimonio ID:", req.params.id);
    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Archivo recibido:", req.file);

    if (!req.file) {
      console.log("⚠️ No se recibió archivo en la petición");
      return res.status(400).json({ message: "No se recibió archivo" });
    }

    subirImagenPatrimonio(req, res, next);
  })

  // Rutas públicas
  .get("/public", getPatrimoniosPublicos)
  .get("/detalle", getDetallePatrimonio);

export default router;
