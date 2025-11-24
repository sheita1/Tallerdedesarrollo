"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env");
dotenv.config({ path: envFilePath });


export const PORT = process.env.PORT || 3000;
export const HOST = process.env.DB_HOST || "localhost";
export const DB_USERNAME = process.env.DB_USER || "postgres";
export const PASSWORD = process.env.DB_PASSWORD || "seba123";
export const DATABASE = process.env.DB_NAME || "juntavecinos";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "clave_segura_default";
export const cookieKey = process.env.cookieKey || "cookie_default";


console.log("🛠️ Configuración de entorno:");
console.log("✅ DB_HOST:", HOST);
console.log("✅ DB_NAME:", DATABASE);
console.log("✅ DB_USER:", DB_USERNAME);
console.log("✅ DB_PASSWORD:", PASSWORD);
console.log("✅ JWT_SECRET:", ACCESS_TOKEN_SECRET);
