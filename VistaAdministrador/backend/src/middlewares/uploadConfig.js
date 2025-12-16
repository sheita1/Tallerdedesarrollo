import multer from "multer";
import path from "path";
import fs from "fs";
// Las importaciones de fileURLToPath y dirname ya no son estrictamente necesarias
// si usamos rutas absolutas de Docker, pero las dejamos por limpieza.
import { fileURLToPath } from "url";
import { dirname } from "path";

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ⚠️ CORRECCIÓN CRÍTICA: USAR LA RUTA ABSOLUTA DE DOCKER
    // La ruta en el CONTENEDOR es /app/uploads/patrimonios/
    const destino = "/app/uploads/patrimonios"; 
    console.log("📂 [multer] Guardando imagen en:", destino);

    try {
      // Crear directorio si no existe
      if (!fs.existsSync(destino)) {
        fs.mkdirSync(destino, { recursive: true });
        console.log("🛠️ [multer] Directorio creado:", destino);
      }
      cb(null, destino);
    } catch (err) {
      console.error("💥 [multer] Error creando directorio:", err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .replace(/[^a-zA-Z0-9.\-_() ]/g, "") // elimina caracteres especiales
      .replace(/\s+/g, "_"); // reemplaza espacios por guiones bajos

    const nombreFinal = `${name}-${Date.now()}${ext}`;
    console.log("📝 [multer] Nombre final del archivo:", nombreFinal);
    cb(null, nombreFinal);
  }
});

const fileFilter = (req, file, cb) => {
  console.log("🔍 [multer] Tipo de archivo recibido:", file.mimetype);
  if (file.mimetype === "image/png") {
    console.log("✅ [multer] Imagen PNG aceptada");
    cb(null, true);
  } else {
    console.log("❌ [multer] Imagen rechazada: solo se permiten PNG");
    cb(new Error("Solo se permiten imágenes PNG"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;