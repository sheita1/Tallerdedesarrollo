"use strict";
import { Router } from "express";
import {
  registrarEscaneoQR,
  obtenerTotalEscaneos,
  obtenerEscaneosPorDia
} from "../controllers/qr.controller.js";

const router = Router();

router.post("/scan", registrarEscaneoQR);
router.get("/stats/total", obtenerTotalEscaneos);
router.get("/stats/por-dia", obtenerEscaneosPorDia);

export default router;
