"use strict";
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

// ✅ rutas
import indexRoutes from "./routes/index.routes.js";
import patrimonioRoutes from "./routes/patrimonio.routes.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    // ✅ Configuración CORS para panel y turista (local + producción)
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

    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "lax",
        },
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    // ✅ Servir imágenes estáticas
    app.use(
      "/patrimonios",
      express.static(path.join(process.cwd(), "uploads/patrimonios"))
    );
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    // ✅ Montar rutas
    app.use("/api", indexRoutes);
    app.use("/api/patrimonios", patrimonioRoutes);

    // ✅ Escuchar en todas las interfaces
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
      console.log("=> Servidor accesible desde la red local y Apache");
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();

    // ⚠️ Solo crear usuarios/patrimonios iniciales en desarrollo
    if (process.env.NODE_ENV !== "production") {
      await createUsers();
      await createPatrimonios();
    }
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error)
  );
