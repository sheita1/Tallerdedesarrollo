"use strict";
import dotenv from "dotenv";

// ✅ ES Modules: definir __dirname y __filename
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Cargar .env con ruta absoluta robusta (no depende del cwd)
dotenv.config({ path: join(__dirname, "../.env") });

import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import path from "path";

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

    // CORS
    app.use(
      cors({
        credentials: true,
        origin: [
          "http://localhost:5173",
          "http://localhost:8080",
          "http://146.83.198.35:1555",
          "https://146.83.198.35:1556",
        ],
      })
    );

    // Middlewares
    app.use(morgan("dev"));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser(cookieKey));
    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup(passport);

    // ✅ Servir archivos estáticos de uploads
    app.use("/uploads", express.static(join(__dirname, "../../uploads")));

    // --- 🚨 INICIO: CONFIGURACIÓN PARA SERVIR FRONTENDS ESTÁTICOS (CRÍTICO) 🚨 ---
    
    // 1. Servir Frontend Administrador (URL: /admin)
    app.use(
      '/admin', 
      express.static(join(__dirname, '..', 'public', 'admin'))
    );
    // Para el ruteo interno de React (SPA)
    app.get('/admin/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
    });

    // 2. Servir Frontend Turista (URL: /turista)
    app.use(
      '/turista', 
      express.static(join(__dirname, '..', 'public', 'turista'))
    );
    // Para el ruteo interno de React (SPA)
    app.get('/turista/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'turista', 'index.html'));
    });

    // --- 🚨 FIN: BLOQUE DE CÓDIGO AÑADIDO (CRÍTICO) 🚨 ---

    // Rutas API
    app.use("/api", indexRoutes);
    app.use("/api/patrimonios", patrimonioRoutes);

    // DB
    await connectDB();
    await createUsers();
    await createPatrimonios();

    // Servidor
    const port = PORT || 4001;
    app.listen(port, () => {
      console.log(`🚀 Servidor backend corriendo en ${HOST}:${port}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

setupServer();