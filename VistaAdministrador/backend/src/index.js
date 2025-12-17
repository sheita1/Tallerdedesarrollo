"use strict";
import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createUsers, createPatrimonios } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";

// Rutas
import indexRoutes from "./routes/index.routes.js";
// import patrimonioRoutes from "./routes/patrimonio.routes.js"; // ❌ LO QUITAMOS para evitar conflictos si indexRoutes ya lo llama

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupServer() {
  try {
    const app = express();
    app.disable("x-powered-by");

    // ✅ Middlewares
    // En producción/servidor, es vital permitir el origen correcto o '*' para pruebas
    app.use(cors({ 
      credentials: true, 
      origin: true // Permite que el frontend (puerto 1555) hable con el backend (1556)
    }));
    
    app.use(morgan("dev"));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser(cookieKey));
    app.use(session({ secret: cookieKey, resave: false, saveUninitialized: false }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup(passport);

    // -----------------------------------------------------------------
    // ✅ 1. SERVIDOR DE ARCHIVOS (UPLOADS)
    // -----------------------------------------------------------------
    const UPLOADS_PATH = "/app/uploads";
    app.use("/uploads", express.static(UPLOADS_PATH));
    console.log(`🖼️ Carpeta pública configurada: ${UPLOADS_PATH}`);

    // -----------------------------------------------------------------
    // ✅ 2. RUTAS DE API (SOLO UNA ENTRADA PRINCIPAL)
    // -----------------------------------------------------------------
    // Usamos solo /api y confiamos en que indexRoutes derive lo demás.
    app.use("/api", indexRoutes);

    // -----------------------------------------------------------------
    // ✅ 3. INICIO
    // -----------------------------------------------------------------
    await connectDB();
    
    // Ejecutamos setups iniciales (con try/catch para que no tumben el server si fallan)
    try {
        await createUsers();
        await createPatrimonios();
    } catch (e) {
        console.warn("⚠️ Advertencia en setup inicial de datos:", e.message);
    }

    const port = PORT || 4001;
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Backend listo en http://0.0.0.0:${port}`);
    });

  } catch (error) {
    console.error("❌ Error fatal al iniciar:", error);
    process.exit(1);
  }
}

setupServer();