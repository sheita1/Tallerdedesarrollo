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

import { AppDataSource } from "../config/configDb.js"; // ✅ usa tu instancia existente

// Obtener un patrimonio por ID o nombre
export async function getPatrimonio(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error } = patrimonioQueryValidation.validate({ id, nombre });
    if (error) return handleErrorClient(res, 400, error.message);

    const [patrimonio, errorPatrimonio] = await getPatrimonioService({ id, nombre });
    if (errorPatrimonio) return handleErrorClient(res, 404, errorPatrimonio);

    handleSuccess(res, 200, "Patrimonio encontrado", patrimonio);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los patrimonios
export async function getPatrimonios(req, res) {
  try {
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
    handleErrorServer(res, 500, error.message);
  }
}

// Crear un nuevo patrimonio
export async function createPatrimonio(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = patrimonioBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );
    }

    const [nuevoPatrimonio, errorCreacion] = await createPatrimonioService(body);
    if (errorCreacion) {
      return handleErrorClient(res, 400, "Error al registrar el patrimonio", errorCreacion);
    }

    handleSuccess(res, 201, "Patrimonio registrado correctamente", nuevoPatrimonio);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un patrimonio existente
export async function updatePatrimonio(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = patrimonioQueryValidation.validate({ id, nombre });
    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message
      );
    }

    const { error: bodyError } = patrimonioBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );
    }

    const [patrimonio, patrimonioError] = await updatePatrimonioService({ id, nombre }, body);
    if (patrimonioError) {
      return handleErrorClient(res, 400, "Error modificando el patrimonio", patrimonioError);
    }

    handleSuccess(res, 200, "Patrimonio modificado correctamente", patrimonio);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un patrimonio
export async function deletePatrimonio(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error: queryError } = patrimonioQueryValidation.validate({ id, nombre });
    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message
      );
    }

    const [patrimonioDelete, errorPatrimonioDelete] = await deletePatrimonioService({ id, nombre });
    if (errorPatrimonioDelete) {
      return handleErrorClient(res, 404, "Error eliminando el patrimonio", errorPatrimonioDelete);
    }

    handleSuccess(res, 200, "Patrimonio eliminado correctamente", patrimonioDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// ✅ Patrimonios públicos para vista turista
export async function getPatrimoniosPublicos(req, res) {
  try {
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
    handleErrorServer(res, 500, error.message);
  }
}

// ✅ Detalle de patrimonio con galería
export async function getDetallePatrimonio(req, res) {
  try {
    const { id } = req.query;
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
    handleErrorServer(res, 500, error.message);
  }
}
