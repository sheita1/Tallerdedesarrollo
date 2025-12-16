"use strict";
import dotenv from "dotenv";

// ✅ ES Modules: definir __dirname y __filename
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs"; 
import mime from "mime-types"; 
import path from "path"; // Necesario para la manipulación de rutas

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

    // ✅ CORS
    app.use(
      cors({
        credentials: true,
        origin: true,
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

    // 🛑 ATENCIÓN: Las dos rutas anteriores (imagen-emergencia y express.static)
    // 🛑 Se reemplazan por esta única ruta dinámica para evitar el conflicto 404.
    
    // -----------------------------------------------------------------
    // ✅ SOLUCIÓN FINAL DINÁMICA: Captura explícitamente /uploads/...
    // Esto tiene mayor prioridad que la mayoría de los middlewares de error 404
    // -----------------------------------------------------------------
    app.get('/uploads/:subcarpeta/:filename', (req, res) => {
        const { subcarpeta, filename } = req.params;
        
        // Ruta física dentro del contenedor: /app/uploads/patrimonios/nombre.png
        const rutaAbsoluta = path.join("/app/uploads", subcarpeta, filename);
        
        console.log(`📥 [GET UPLOADS CATCH] Solicitud de archivo: ${subcarpeta}/${filename}`);
        
        // 1. Verificación de existencia
        if (fs.existsSync(rutaAbsoluta)) {
            console.log(`✅ [GET UPLOADS CATCH] Archivo encontrado y enviado: ${rutaAbsoluta}`);
            
            // 2. Forzar el tipo MIME
            const mimeType = mime.lookup(rutaAbsoluta);
            if (mimeType) {
                res.setHeader('Content-Type', mimeType);
            }

            // 3. Servir el archivo
            return res.sendFile(rutaAbsoluta, (err) => {
                if (err) {
                    console.error(`💥 Error al enviar archivo:`, err);
                    res.status(500).send("Error interno al enviar la imagen.");
                }
            });
        } else {
            console.log(`❌ [GET UPLOADS CATCH] Archivo no encontrado en el disco: ${rutaAbsoluta}`);
            res.status(404).send("Archivo físico no encontrado en el disco (404).");
        }
    });


    // --- FRONTENDS ESTÁTICOS ---
    app.use('/admin', express.static(join(__dirname, '..', 'public', 'admin')));
    app.get('/admin/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
    });

    app.use('/turista', express.static(join(__dirname, '..', 'public', 'turista')));
    app.get('/turista/*', (req, res) => {
      res.sendFile(join(__dirname, '..', 'public', 'turista', 'index.html'));
    });

    // --- RUTAS API ---
    app.use("/api", indexRoutes);
    app.use("/api/patrimonios", patrimonioRoutes);
    // Asegúrate de incluir aquí el router de imágenes si lo tienes.


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