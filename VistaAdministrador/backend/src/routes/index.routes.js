"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import patrimonioRoutes from "./patrimonio.routes.js";
import imagenesRoutes from "./imagenes.routes.js"; // ✅ Importación necesaria

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/patrimonio", patrimonioRoutes)
  .use("/patrimonios", patrimonioRoutes)
  .use("/imagenes", imagenesRoutes); // ✅ Monta correctamente la ruta DELETE /imagenes/:id

export default router;
