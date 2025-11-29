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

const patrimonioRepo = AppDataSource.getRepository("Patrimonio");

// Obtener un patrimonio por ID o nombre
export async function getPatrimonio(req, res) {
  try {
    const { id, nombre } = req.query;
    console.log("📥 [GET Patrimonio] Query:", req.query);

    const { error } = patrimonioQueryValidation.validate({ id, nombre });
    if (error) return handleErrorClient(res, 400, error.message);

    const [patrimonio, errorPatrimonio] = await getPatrimonioService({ id, nombre });
    if (errorPatrimonio) return handleErrorClient(res, 404, errorPatrimonio);

    handleSuccess(res, 200, "Patrimonio encontrado", patrimonio);
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
      return handleErrorClient(res, 400, "ID inválido");
    }

    const repo = AppDataSource.getRepository("Patrimonio");
    const imagenRepo = AppDataSource.getRepository("PatrimonioImagen");

    const patrimonio = await repo.findOneBy({ id: parseInt(id) });
    if (!patrimonio || patrimonio.estado !== "activo" || !patrimonio.visibleEnTurismo) {
      return handleErrorClient(res, 404, "Patrimonio no encontrado o no visible");
    }

    const imagenes = await imagenRepo.find({ where: { patrimonioId: patrimonio.id } });

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

// Subida de imagen principal
export async function subirImagenPatrimonio(req, res) {
  try {
    console.log("📥 [UPLOAD Imagen] Params:", req.params);
    console.log("📥 [UPLOAD Imagen] Body:", req.body);
    console.log("📥 [UPLOAD Imagen] File:", req.file);

    const { id } = req.params;
    if (!id) {
      return handleErrorClient(res, 400, "Falta ID de patrimonio");
    }
    if (!req.file) {
      return handleErrorClient(res, 400, "No se recibió archivo de imagen");
    }

    const fileName = req.file.filename;
    console.log(`🖼️ [UPLOAD Imagen] Guardando '${fileName}' en patrimonio id=${id}`);

    const result = await patrimonioRepo.update({ id: parseInt(id) }, { imagen: fileName });
    console.log("🟢 [UPLOAD Imagen] Resultado update:", result);

    handleSuccess(res, 200, "Imagen subida correctamente", { id, file: fileName });
  } catch (error) {
    console.error("💥 [UPLOAD Imagen] Error:", error);
    handleErrorServer(res, 500, error.message);
  }
}
