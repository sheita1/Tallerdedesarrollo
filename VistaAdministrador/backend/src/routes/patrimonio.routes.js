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
  subirImagenPatrimonio,   // ✅ controlador de subida de imagen principal
} from "../controllers/patrimonio.controller.js";

const router = Router();

router
  // CRUD principal
  .get("/", getPatrimonios)
  .get("/detail/", getPatrimonio)
  .patch("/detail/", updatePatrimonio)
  .delete("/detail/", deletePatrimonio)
  .post("/", createPatrimonio)

  // ✅ Subida de imagen principal (una sola imagen por patrimonio)
  // Se envía como form-data: campo "imagen" (file) y el id en la URL
  .post("/imagen/:id", upload.single("imagen"), subirImagenPatrimonio)

  // Rutas públicas para turistas
  .get("/public", getPatrimoniosPublicos)
  .get("/detalle", getDetallePatrimonio);

export default router;
