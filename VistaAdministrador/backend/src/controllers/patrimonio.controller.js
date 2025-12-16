"use strict";

import {
  deletePatrimonioService,
  getPatrimonioService,
  getPatrimoniosService,
  updatePatrimonioService,
  createPatrimonioService,
} from "../services/patrimonio.service.js";

import {
  patrimonioBodyValidation,
  patrimonioQueryValidation,
} from "../validations/patrimonio.validation.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

import { AppDataSource } from "../config/configDb.js";
// 🛑 IMPORTACIÓN NECESARIA PARA LA GALERÍA 🛑
import PatrimonioImagen from "../entity/PatrimonioImagen.js"; 

const patrimonioRepo = AppDataSource.getRepository("Patrimonio");

// ---------------------------------------------------
// 1. OBTENER UN PATRIMONIO (CON LINK QR DINÁMICO)
// ---------------------------------------------------
export async function getPatrimonio(req, res) {
  try {
    console.log("📥 [GET Patrimonio] Query:", req.query);

    const { id, nombre } = req.query;
    const { error } = patrimonioQueryValidation.validate({ id, nombre });
    if (error) return handleErrorClient(res, 400, error.message);

    const [patrimonio, errorPatrimonio] = await getPatrimonioService({ id, nombre });
    console.log("🔎 [GET Patrimonio] Resultado:", patrimonio);

    if (errorPatrimonio) return handleErrorClient(res, 404, errorPatrimonio);

    // ✅ MAGIA QR: Detectamos protocolo y host automáticamente
    const protocol = req.protocol; 
    const host = req.get("host");  
    
    // Generamos la URL que el Turista usará
    const urlParaQR = `${protocol}://${host}/ver/${patrimonio.id}`;

    // Enviamos el patrimonio + el link generado
    handleSuccess(res, 200, "Patrimonio encontrado", {
      ...patrimonio,
      linkQR: urlParaQR 
    });

  } catch (error) {
    console.error("💥 [GET Patrimonio] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los patrimonios
export async function getPatrimonios(req, res) {
  try {
    console.log("📥 [GET Patrimonios]");
    const [patrimonios, errorPatrimonios] = await getPatrimoniosService();

    console.log("🔎 [GET Patrimonios] Resultado:", patrimonios);

    if (errorPatrimonios) {
      return handleErrorClient(res, 500, "Error al obtener patrimonios", errorPatrimonios);
    }

    if (!Array.isArray(patrimonios)) {
      return handleErrorServer(res, 500, "Respuesta inesperada del servicio");
    }

    if (patrimonios.length === 0) {
      return handleSuccess(res, 204);
    }

    return handleSuccess(res, 200, "Patrimonios encontrados", patrimonios);
  } catch (error) {
    console.error("💥 [GET Patrimonios] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Crear un nuevo patrimonio
export async function createPatrimonio(req, res) {
  try {
    console.log("📥 [CREATE Patrimonio] Body:", req.body);

    const { body } = req;
    const { error: bodyError } = patrimonioBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    const [nuevoPatrimonio, errorCreacion] = await createPatrimonioService(body);
    console.log("🟢 [CREATE Patrimonio] Resultado:", nuevoPatrimonio);

    if (errorCreacion) {
      return handleErrorClient(res, 400, "Error al registrar el patrimonio", errorCreacion);
    }

    handleSuccess(res, 201, "Patrimonio registrado correctamente", nuevoPatrimonio);
  } catch (error) {
    console.error("💥 [CREATE Patrimonio] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un patrimonio existente
export async function updatePatrimonio(req, res) {
  try {
    console.log("📥 [UPDATE Patrimonio] Query:", req.query, "Body:", req.body);

    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = patrimonioQueryValidation.validate({ id, nombre });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const { error: bodyError } = patrimonioBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    const [patrimonio, patrimonioError] = await updatePatrimonioService({ id, nombre }, body);
    console.log("🟢 [UPDATE Patrimonio] Resultado:", patrimonio);

    if (patrimonioError) {
      return handleErrorClient(res, 400, "Error modificando el patrimonio", patrimonioError);
    }

    handleSuccess(res, 200, "Patrimonio modificado correctamente", patrimonio);
  } catch (error) {
    console.error("💥 [UPDATE Patrimonio] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un patrimonio
export async function deletePatrimonio(req, res) {
  try {
    console.log("📥 [DELETE Patrimonio] Query:", req.query);

    const { id, nombre } = req.query;
    const { error: queryError } = patrimonioQueryValidation.validate({ id, nombre });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const [patrimonioDelete, errorPatrimonioDelete] = await deletePatrimonioService({ id, nombre });
    console.log("🟢 [DELETE Patrimonio] Resultado:", patrimonioDelete);

    if (errorPatrimonioDelete) {
      return handleErrorClient(res, 404, "Error eliminando el patrimonio", errorPatrimonioDelete);
    }

    handleSuccess(res, 200, "Patrimonio eliminado correctamente", patrimonioDelete);
  } catch (error) {
    console.error("💥 [DELETE Patrimonio] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Patrimonios públicos
export async function getPatrimoniosPublicos(req, res) {
  try {
    console.log("📥 [GET Patrimonios Públicos]");
    const repo = AppDataSource.getRepository("Patrimonio");
    const patrimonios = await repo.find({
      where: { estado: "activo", visibleEnTurismo: true },
      order: { nombre: "ASC" },
    });

    console.log("🔎 [GET Patrimonios Públicos] Resultado:", patrimonios);

    const data = patrimonios.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      ubicacion: p.ubicacion,
      tipo: p.tipo,
      imagenDestacada: p.imagen,
    }));

    handleSuccess(res, 200, "Patrimonios públicos encontrados", data);
  } catch (error) {
    console.error("💥 [GET Patrimonios Públicos] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// Detalle de patrimonio
export async function getDetallePatrimonio(req, res) {
  try {
    const { id } = req.query;
    console.log("📥 [GET Detalle Patrimonio] id:", id);

    if (!id || isNaN(parseInt(id))) {
      console.log("⚠️ [GET Detalle Patrimonio] ID inválido");
      return handleErrorClient(res, 400, "ID inválido");
    }

    const repo = AppDataSource.getRepository("Patrimonio");
    const imagenRepo = AppDataSource.getRepository("PatrimonioImagen");

    const patrimonio = await repo.findOneBy({ id: parseInt(id) });
    console.log("🔎 [GET Detalle Patrimonio] Patrimonio encontrado:", patrimonio);

    if (!patrimonio || patrimonio.estado !== "activo" || !patrimonio.visibleEnTurismo) {
      console.log("⚠️ [GET Detalle Patrimonio] Patrimonio no encontrado o no visible");
      return handleErrorClient(res, 404, "Patrimonio no encontrado o no visible");
    }

    // ASUMO que la entidad PatrimonioImagen usa 'patrimonioId'
    const imagenes = await imagenRepo.find({ where: { patrimonioId: patrimonio.id } });
    console.log("📸 [GET Detalle Patrimonio] Imágenes encontradas:", imagenes);

    const data = {
      id: patrimonio.id,
      nombre: patrimonio.nombre,
      descripcion: patrimonio.descripcion,
      ubicacion: patrimonio.ubicacion,
      tipo: patrimonio.tipo,
      imagenDestacada: patrimonio.imagen,
      galeria: imagenes.map((img) => img.ruta),
    };

    handleSuccess(res, 200, "Detalle de patrimonio", data);
  } catch (error) {
    console.error("💥 [GET Detalle Patrimonio] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}

// ---------------------------------------------------
// 2. SUBIDA DE IMAGEN (CORREGIDA PARA GALERÍA Y RESPUESTA)
// ---------------------------------------------------
export async function subirImagenPatrimonio(req, res) {
  try {
    console.log("📥 [UPLOAD Imagen] **subirImagenPatrimonio** llamado. Iniciando procesamiento.");
    
    const { id } = req.params;

    if (!id) {
      console.error("⚠️ [UPLOAD Imagen] Falta ID de patrimonio en params.");
      return handleErrorClient(res, 400, "Falta ID de patrimonio");
    }
    if (!req.file) {
      console.error("❌ [UPLOAD Imagen] req.file no recibido. Multer falló o no se envió el archivo.");
      return handleErrorClient(res, 400, "No se recibió archivo");
    }

    // 🚩 LOG CRÍTICO 1: Metadatos del archivo
    console.log("💾 [UPLOAD Imagen] Metadatos recibidos:", JSON.stringify({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    }, null, 2));

    // ✅ Ruta relativa completa que usará el frontend/cliente
    const fileName = req.file.filename;
    const rutaParaDB = `/uploads/patrimonios/${fileName}`; 

    console.log("🖼️ [UPLOAD Imagen] Ruta para guardar en la DB:", rutaParaDB);

    const patrimonioId = parseInt(id);
    
    // 🚩 LOG CRÍTICO 2: Verificación de Patrimonio
    console.log(`🔎 [UPLOAD Imagen] Buscando Patrimonio ID: ${patrimonioId}`);
    const patrimonioExistente = await patrimonioRepo.findOneBy({ id: patrimonioId });

    if (!patrimonioExistente) {
      console.error(`⚠️ [UPLOAD Imagen] Patrimonio ID ${patrimonioId} no encontrado en DB.`);
      return handleErrorClient(res, 404, "Patrimonio no encontrado");
    }
    
    // ----------------------------------------------------------------------------------
    // 🛑 CORRECCIONES DE PERSISTENCIA Y GALERÍA 🛑
    // ----------------------------------------------------------------------------------
    const imagenRepo = AppDataSource.getRepository(PatrimonioImagen);

    // 1. Actualizar la imagen destacada (campo 'imagen')
    const result = await patrimonioRepo.update({ id: patrimonioId }, { imagen: rutaParaDB });
    
    if (result.affected === 0) {
      console.error("❌ [UPLOAD Imagen] Fallo al actualizar la imagen destacada.");
    }

    // 2. Insertar la imagen en la tabla de Galería (PatrimonioImagen)
    const nuevaImagenGaleria = imagenRepo.create({
      ruta: rutaParaDB,
      patrimonioId: patrimonioId,
      // ASUMO que el campo 'id' se genera automáticamente
    });
    await imagenRepo.save(nuevaImagenGaleria);
    console.log("📸 [UPLOAD Imagen] Imagen persistida en la Galería con ID:", nuevaImagenGaleria.id);

    // ----------------------------------------------------------------------------------

    // Respuesta con datos completos para facilitar el debug en el frontend
    // ✅ CORRECCIÓN DE RESPUESTA: Devolver el objeto con el ID y la ruta que el frontend espera
    handleSuccess(res, 200, "Imagen subida correctamente", {
      // El Frontend necesita un ID real y la clave 'ruta' para que la galería funcione
      id: nuevaImagenGaleria.id, 
      ruta: rutaParaDB,
      patrimonioId: patrimonioId,
    });
  } catch (error) {
    console.error("💥 [UPLOAD Imagen] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}