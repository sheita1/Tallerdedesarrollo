"use strict";
import { Router } from "express";

import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import patrimonioRoutes from "./patrimonio.routes.js";
import imagenesRoutes from "./imagenes.routes.js";
import qrRoutes from "./qr.routes.js";

const router = Router();

// ✅ Ruta raíz de la API
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Subrutas
router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/patrimonio", patrimonioRoutes)
  .use("/patrimonios", patrimonioRoutes)
  .use("/imagenes", imagenesRoutes)
  .use("/qr", qrRoutes);

export default router;
