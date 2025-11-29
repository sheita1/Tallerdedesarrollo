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
          "http://146.83.198.35:1555", // Apache HTTP
          "https://146.83.198.35:1556", // Apache HTTPS
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

    // Rutas
    app.use("/api", indexRoutes);
    app.use("/api/patrimonios", patrimonioRoutes);

    // DB
    await connectDB();
    await createUsers();
    await createPatrimonios();

    // Servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

setupServer();
