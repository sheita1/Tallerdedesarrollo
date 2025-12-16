"use strict";
import { Router } from "express";
// Usar importación nombrada para evitar el ReferenceError
import { uploader } from "../middlewares/uploadConfig.js"; 
import {
  deletePatrimonio,
  getPatrimonio,
  getPatrimonios,
  updatePatrimonio,
  createPatrimonio,
  getPatrimoniosPublicos,
  getDetallePatrimonio,
  subirImagenPatrimonio, // Tu función del controller
} from "../controllers/patrimonio.controller.js";

const router = Router();

// CRUD principal
router
  .get("/", getPatrimonios)                     
  .get("/detail", getPatrimonio)               
  .patch("/detail", updatePatrimonio)           
  .delete("/detail", deletePatrimonio)          
  .post("/", createPatrimonio);                 

// Subida de imágenes
router
  // 🛑 PUNTOS DE LOGGING AGREGADOS PARA DEBUG 🛑
  .post("/imagen/:id", uploader.single("imagen"), (req, res, next) => {
    console.log("📥 [POST] Solicitud de subida de imagen para patrimonio ID:", req.params.id);
    
    // 🚩 LOG CRÍTICO 1: ¿Multer recibió el archivo?
    if (req.file) {
      console.log(`✅ [ROUTE] Multer SUCCESS. Archivo recibido. Nombre: ${req.file.filename}, Tamaño: ${req.file.size} bytes`);
      console.log(`🔗 [ROUTE] Path donde Multer lo dejó: ${req.file.path}`);
    } else {
      console.log(`❌ [ROUTE] Multer FAILURE. req.file está vacío.`);
      
      // Intenta identificar errores comunes de Multer
      if (req.file === undefined && req.body && Object.keys(req.body).length > 0) {
        console.log("⚠️ [ROUTE] Cuerpo del request recibido, pero no archivo. Posible error de nombre de campo ('imagen') o límite de tamaño.");
      }
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo" });
    }
    // Si Multer pasó, llama al controller para guardar en DB
    subirImagenPatrimonio(req, res, next);
  })
  // Repetir logs para /imagenes (si lo usas)
  .post("/imagenes/:id", uploader.single("imagen"), (req, res, next) => {
    console.log("📥 [POST] Subida de imagen (plural) para patrimonio ID:", req.params.id);
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo" });
    }
    subirImagenPatrimonio(req, res, next);
  });

// Nueva ruta: obtener imágenes de un patrimonio
router.get("/imagenes/patrimonio/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🔍 [GET] Solicitud de lista de imágenes para Patrimonio ID: ${id}`);
  try {
    // Aquí debería ir la lógica para obtener la lista de rutas de imagen de la BD
    return res.json({
      status: "Success",
      message: `Imágenes del patrimonio ${id}`,
      data: [] // reemplaza con tu lógica real
    });
  } catch (err) {
    console.error("💥 [ROUTE] Error al obtener lista de imágenes:", err.message);
    return res.status(500).json({ message: "Error interno al obtener lista de imágenes", error: err.message });
  }
});

// Rutas públicas
router
  .get("/public", getPatrimoniosPublicos)       
  .get("/detalle", getDetallePatrimonio);       

export default router;