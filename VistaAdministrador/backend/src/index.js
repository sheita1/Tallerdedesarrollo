"use strict";
import dotenv from "dotenv";

// ✅ Cargar variables de entorno desde Docker (NO desde ../.env)
dotenv.config();

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import mime from "mime-types";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";

import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createUsers, createPatrimonios } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";

// Rutas
import indexRoutes from "./routes/index.routes.js";
import patrimonioRoutes from "./routes/patrimonio.routes.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    // ✅ Middlewares básicos
    app.use(cors({ credentials: true, origin: true }));
    app.use(morgan("dev"));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser(cookieKey));
    app.use(
      session({ secret: cookieKey, resave: false, saveUninitialized: false })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup(passport);

    // -----------------------------------------------------------------
    // ✅ ✅ ✅ SERVIDOR DE ARCHIVOS /UPLOADS (CORRECCIÓN FINAL)
    // -----------------------------------------------------------------

    // ✅ Ruta REAL dentro del contenedor Docker
    const UPLOADS_PATH = "/app/uploads";

    // ✅ Servir archivos estáticos desde /app/uploads
    app.use("/uploads", express.static(UPLOADS_PATH));

    console.log(`🖼️ Servidor de archivos estático configurado: /uploads -> ${UPLOADS_PATH}`);

    // -----------------------------------------------------------------
    // ✅ RUTAS DE API
    // -----------------------------------------------------------------

    app.use("/api", indexRoutes);
    app.use("/api/patrimonios", patrimonioRoutes);

    // -----------------------------------------------------------------
    // ✅ FRONTENDS ESTÁTICOS
    // -----------------------------------------------------------------

    app.use('/admin', express.static(join(__dirname, '..', 'public', 'admin')));
    app.get('/admin/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
    });

    app.use('/turista', express.static(join(__dirname, '..', 'public', 'turista')));
    app.get('/turista/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'turista', 'index.html'));
    });

    // -----------------------------------------------------------------
    // ✅ INICIO DE SERVIDOR Y BASE DE DATOS
    // -----------------------------------------------------------------

    await connectDB();
    await createUsers();
    await createPatrimonios();

    const port = PORT || 4001;

    // ✅ Escuchar en 0.0.0.0 para que Docker exponga el puerto
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Servidor backend corriendo en ${HOST}:${port}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

setupServer();
