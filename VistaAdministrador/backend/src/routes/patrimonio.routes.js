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
  getDetallePatrimonio       
} from "../controllers/patrimonio.controller.js";
import {
  subirImagenPatrimonio,
  subirImagenesPatrimonio,
  obtenerImagenesPatrimonio
} from "../controllers/patrimonios.js";

const router = Router();



router
  .get("/", getPatrimonios)
  .get("/detail/", getPatrimonio)
  .get("/imagenes/:id", obtenerImagenesPatrimonio)
  .patch("/detail/", updatePatrimonio)
  .delete("/detail/", deletePatrimonio)
  .post("/", createPatrimonio)
  .post("/imagen/:id", upload.single("imagen"), subirImagenPatrimonio)
  .post("/imagenes/:id", upload.array("imagenes", 10), subirImagenesPatrimonio)


  //rutas publicas turistas
  .get("/public", getPatrimoniosPublicos)          
  .get("/detalle", getDetallePatrimonio);          

export default router;
