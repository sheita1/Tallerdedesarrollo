"use strict";
import dotenv from "dotenv";

// Cargar automáticamente el archivo .env desde la raíz del backend
dotenv.config();

// Variables de entorno principales
export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || "http://localhost";

// Base de datos PostgreSQL
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT || 5432;

// Nombres consistentes
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;

// Aliases para compatibilidad con configDb.js
export const DATABASE = DB_NAME;
export const DB_USERNAME = DB_USER;
export const PASSWORD = DB_PASSWORD;

// Seguridad y autenticación
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "clave_segura_default";
export const cookieKey = process.env.COOKIE_KEY || "cookie_default";

export const NODE_ENV = process.env.NODE_ENV || "development";

// Validación de variables críticas
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error("❌ Error: faltan variables de entorno para la base de datos");
  process.exit(1);
}

