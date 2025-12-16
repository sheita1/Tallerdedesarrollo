"use strict";
import { Router } from "express";
// Importar uploader, aunque no se use aquí, por si se usa en otra parte
// import { uploader } from "../middlewares/uploadConfig.js"; 
import {
  deletePatrimonio,
  getPatrimonio,
  getPatrimonios,
  updatePatrimonio,
  createPatrimonio,
  getPatrimoniosPublicos,
  getDetallePatrimonio,
  // Ya no importamos subirImagenPatrimonio aquí si no se usa directamente.
} from "../controllers/patrimonio.controller.js";

const router = Router();

// CRUD principal
router
  .get("/", getPatrimonios)                     
  .get("/detail", getPatrimonio)               
  .patch("/detail", updatePatrimonio)           
  .delete("/detail", deletePatrimonio)          
  .post("/", createPatrimonio);                 

// 🛑 ¡BLOQUE DE SUBIDA DE IMÁGENES ELIMINADO! 🛑
/* router
  .post("/imagen/:id", ... )
  .post("/imagenes/:id", ... );
*/

// Nueva ruta: obtener imágenes de un patrimonio (debería estar en imagenes.routes, pero se mantiene si se usa así)
router.get("/imagenes/patrimonio/:id", (req, res) => {
  // Esta lógica de obtener lista de imágenes es mejor que vaya a un controlador.
  // Deberías usar obtenerImagenesPatrimonio si existe.
  // Si no, tu router principal la interceptará.
  return res.status(501).json({ message: "La ruta de obtención de lista de imágenes no tiene lógica implementada." });
});


// Rutas públicas
router
  .get("/public", getPatrimoniosPublicos)       
  .get("/detalle", getDetallePatrimonio);       

export default router;