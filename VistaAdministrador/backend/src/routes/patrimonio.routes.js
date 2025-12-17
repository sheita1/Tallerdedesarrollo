"use strict";
import { Router } from "express";
import {
  deletePatrimonio,
  getPatrimonio,
  getPatrimonios,
  updatePatrimonio,
  createPatrimonio,
  getPatrimoniosPublicos,
  getDetallePatrimonio
} from "../controllers/patrimonio.controller.js";

const router = Router();

// ✅ CRUD principal
router
  .get("/", getPatrimonios)
  .get("/detail", getPatrimonio)
  .patch("/detail", updatePatrimonio)
  .delete("/detail", deletePatrimonio)
  .post("/", createPatrimonio);

// ✅ Rutas públicas
router
  .get("/public", getPatrimoniosPublicos)
  .get("/detalle", getDetallePatrimonio);

// ✅ ❌ RUTA ELIMINADA (era la que devolvía 501)
// router.get("/imagenes/patrimonio/:id", ...)

export default router;
