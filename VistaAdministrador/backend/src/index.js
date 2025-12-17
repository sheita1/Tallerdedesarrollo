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



import indexRoutes from "./routes/index.routes.js";

import patrimonioRoutes from "./routes/patrimonio.routes.js";



const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);



async function setupServer() {

  try {

const app = express();

    app.disable("x-powered-by");



    // 🕵️‍♂️ LOG CHIVATO: Imprime TODAS las peticiones que llegan

    app.use((req, res, next) => {

        console.log(`➡️  [REQUEST] ${req.method} ${req.originalUrl}`);

        next();

    });



    app.use(cors({ credentials: true, origin: true }));

    app.use(morgan("dev"));

    app.use(json());

    app.use(urlencoded({ extended: false }));

    app.use(cookieParser(cookieKey));

    app.use(session({ secret: cookieKey, resave: false, saveUninitialized: false }));

    app.use(passport.initialize());

    app.use(passport.session());

    passportJwtSetup(passport);



    // Servir imágenes

    const UPLOADS_PATH = "/app/uploads";

    app.use("/uploads", express.static(UPLOADS_PATH));



    // RUTAS

    console.log("🛣️  Cargando ruta: /api/patrimonios");

 app.use("/api/patrimonios", patrimonioRoutes);



    console.log("🛣️  Cargando ruta: /api");

    app.use("/api", indexRoutes);



    // FRONTEND

    app.use('/admin', express.static(join(__dirname, '..', 'public', 'admin')));

    app.get('/admin/*', (req, res) => res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html')));

    app.use('/turista', express.static(join(__dirname, '..', 'public', 'turista')));

    app.get('/turista/*', (req, res) => res.sendFile(join(__dirname, '..', 'public', 'turista', 'index.html')));



    await connectDB();

    const port = PORT || 4001;

    app.listen(port, "0.0.0.0", () => {

      console.log(`🚀 Backend listo en http://0.0.0.0:${port}`);

    });



  } catch (error) {

    console.error("❌ Error fatal:", error);

    process.exit(1);

  }

}



setupServer();