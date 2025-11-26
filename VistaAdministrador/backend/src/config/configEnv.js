"use strict";
import dotenv from "dotenv";

// ✅ Cargar automáticamente el archivo .env desde la raíz del backend
dotenv.config();

// ✅ Variables de entorno
export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || "http://localhost";

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USERNAME = process.env.DB_USER;
export const PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DB_NAME;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "clave_segura_default";
export const cookieKey = process.env.COOKIE_KEY || "cookie_default";

export const NODE_ENV = process.env.NODE_ENV || "development";

// ✅ Validación de variables críticas
if (!DB_HOST || !DB_USERNAME || !PASSWORD || !DATABASE) {
  console.error("❌ Error: faltan variables de entorno para la base de datos");
  process.exit(1);
}

// ✅ Log de configuración (sin mostrar datos sensibles)
console.log("🛠️ Configuración de entorno:");
console.log("✅ DB_HOST:", DB_HOST);
console.log("✅ DB_NAME:", DATABASE);
console.log("✅ DB_USER:", DB_USERNAME);
console.log("✅ DB_PASSWORD:", PASSWORD ? "********" : "NO DEFINIDA");
console.log("✅ JWT_SECRET:", ACCESS_TOKEN_SECRET ? "********" : "NO DEFINIDA");
console.log("✅ COOKIE_KEY:", cookieKey ? "********" : "NO DEFINIDA");
console.log("✅ NODE_ENV:", NODE_ENV);
