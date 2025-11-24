import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

// 🧑‍💼 Formateo de datos de usuario
export function formatUserData(user) {
  return {
    ...user,
    nombreCompleto: startCase(user.nombreCompleto),
    rol: startCase(user.rol),
    rut: formatRut(user.rut),
    createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
  };
}

// 🧠 Conversión de strings a minúsculas
export function convertirMinusculas(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].toLowerCase();
    }
  }
  return obj;
}

// 🔄 Formateo post-actualización de usuario
export function formatPostUpdate(user) {
  return {
    nombreCompleto: startCase(user.nombreCompleto),
    rol: startCase(user.rol),
    rut: formatRut(user.rut),
    email: user.email,
    createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
  };
}

// 🏛️ Formateo de datos de patrimonio
export function formatPatrimonioData(patrimonio) {
  return {
    ...patrimonio,
    nombre: startCase(patrimonio.nombre),
    tipo: startCase(patrimonio.tipo),
    estado: startCase(patrimonio.estado),
    fechaRegistro: formatTempo(patrimonio.fechaRegistro, "DD-MM-YYYY")
  };
}

// 🔄 Formateo post-actualización de patrimonio
export function formatPostUpdatePatrimonio(patrimonio) {
  return {
    id: patrimonio.id,
    nombre: startCase(patrimonio.nombre),
    ubicacion: patrimonio.ubicacion,
    descripcion: patrimonio.descripcion,
    tipo: startCase(patrimonio.tipo),
    estado: startCase(patrimonio.estado),
    fechaRegistro: formatTempo(patrimonio.fechaRegistro, "DD-MM-YYYY")
  };
}
