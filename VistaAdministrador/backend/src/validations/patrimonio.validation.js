"use strict";
import Joi from "joi";

export const patrimonioQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  nombre: Joi.string()
    .min(3)
    .max(255)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 255 caracteres.",
    }),
})
  .or("id", "nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id o nombre.",
  });

export const patrimonioBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 255 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras, números y signos básicos.",
    }),
  ubicacion: Joi.string()
    .min(3)
    .max(255)
    .messages({
      "string.empty": "La ubicación no puede estar vacía.",
      "string.base": "La ubicación debe ser de tipo string.",
      "string.min": "La ubicación debe tener como mínimo 3 caracteres.",
      "string.max": "La ubicación debe tener como máximo 255 caracteres.",
    }),
  descripcion: Joi.string()
    .allow("")
    .max(1000)
    .messages({
      "string.base": "La descripción debe ser de tipo string.",
      "string.max": "La descripción debe tener como máximo 1000 caracteres.",
    }),
  tipo: Joi.string()
    .valid("histórico", "natural", "cultural", "mixto")
    .messages({
      "any.only": "El tipo debe ser uno de: histórico, natural, cultural o mixto.",
      "string.base": "El tipo debe ser de tipo string.",
    }),
  imagen: Joi.string()
    .allow("")
    .max(255)
    .messages({
      "string.base": "La imagen debe ser de tipo string.",
      "string.max": "La imagen debe tener como máximo 255 caracteres.",
    }),
  estado: Joi.string()
    .valid("activo", "inactivo")
    .messages({
      "any.only": "El estado debe ser 'activo' o 'inactivo'.",
      "string.base": "El estado debe ser de tipo string.",
    }),
})
  .or("nombre", "ubicacion", "descripcion", "tipo", "imagen", "estado")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo válido para modificar o crear el patrimonio.",
  });
