"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env");
dotenv.config({ path: envFilePath });


export const PORT = process.env.PORT || 3000;
export const HOST = process.env.DB_HOST; 
export const DB_USERNAME = process.env.DB_USER;
export const PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DB_NAME;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "clave_segura_default";
export const cookieKey = process.env.cookieKey || "cookie_default";


if (!HOST || !DB_USERNAME || !PASSWORD || !DATABASE) {
  console.error("❌ Error: faltan variables de entorno para la base de datos");
  process.exit(1);
}

console.log("🛠️ Configuración de entorno:");
console.log("✅ DB_HOST:", HOST);
console.log("✅ DB_NAME:", DATABASE);
console.log("✅ DB_USER:", DB_USERNAME);
console.log("✅ DB_PASSWORD:", PASSWORD ? "********" : "NO DEFINIDA");
console.log("✅ JWT_SECRET:", ACCESS_TOKEN_SECRET ? "********" : "NO DEFINIDA");
