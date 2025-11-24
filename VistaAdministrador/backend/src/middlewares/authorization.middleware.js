import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    console.log("🔐 Middleware isAdmin activado");
    console.log("📋 req.user recibido:", req.user);

    if (!req.user || !req.user.email) {
      return handleErrorClient(
        res,
        401,
        "No estás autenticado correctamente",
        "No se encontró información de usuario en la sesión."
      );
    }

    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    console.log("👤 Usuario encontrado:", userFound.email, "| Rol:", userFound.rol);

    const rolUser = userFound.rol;

    if (rolUser !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de administrador para realizar esta acción."
      );
    }

    console.log("✅ Usuario autorizado como administrador");
    next();
  } catch (error) {
    console.error("❌ Error en isAdmin:", error);
    handleErrorServer(res, 500, error.message);
  }
}
