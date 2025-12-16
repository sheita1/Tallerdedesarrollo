"use strict";
import dotenv from "dotenv";

// ✅ ES Modules: definir __dirname y __filename
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs"; 
import mime from "mime-types"; 
import path from "path"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Cargar .env
dotenv.config({ path: join(__dirname, "../.env") });

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

    // ✅ CORS y Middlewares básicos
    app.use(cors({ credentials: true, origin: true, }));
    app.use(morgan("dev"));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser(cookieKey));
    app.use(
      session({ secret: cookieKey, resave: false, saveUninitialized: false, })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup(passport);

    // -----------------------------------------------------------------
    // 🛑 SOLUCIÓN DE LECTURA (MÁXIMA PRIORIDAD)
    // -----------------------------------------------------------------
    
    // 1. Mapea la URL pública "/uploads" al directorio físico "/app/uploads"
    // Esto debe ir lo más arriba posible, antes de todas las otras rutas y handlers.
    app.use('/uploads', express.static('/app/uploads')); 
    console.log(`🖼️ Servidor de archivos estático configurado: /uploads -> /app/uploads`);

    // -----------------------------------------------------------------
    // RUTAS DE API Y FRONTEND (VAN DESPUÉS DE LA LECTURA DE ARCHIVOS)
    // -----------------------------------------------------------------
    
    // --- RUTAS API ---
    app.use("/api", indexRoutes);
    app.use("/api/patrimonios", patrimonioRoutes);

    // --- FRONTENDS ESTÁTICOS ---
    app.use('/admin', express.static(join(__dirname, '..', 'public', 'admin')));
    app.get('/admin/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
    });

    app.use('/turista', express.static(join(__dirname, '..', 'public', 'turista')));
    app.get('/turista/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'turista', 'index.html'));
    });

    // -----------------------------------------------------------------
    // 🛑 MANEJADOR DE ERRORES 404 (COMENTADO PARA LA PRUEBA FINAL) 🛑
    // -----------------------------------------------------------------
    
    // Comentamos este bloque. Si la imagen funciona, este era el culpable.
    /*
    app.use((req, res) => {
      console.log(`⚠️ 404: Ruta no encontrada: ${req.method} ${req.url}`);
      res.status(404).send("Ruta de API/Uploads/Assets no encontrada"); 
    });
    */
    
    // DB e Inicio
    await connectDB();
    await createUsers(); 
    await createPatrimonios(); 

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