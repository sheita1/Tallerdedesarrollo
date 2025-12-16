import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🚨 VARIABLE DE ENTORNO PARA RUTA CONSISTENTE
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads"; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construye la ruta absoluta usando la variable de entorno y añade 'patrimonios'
    const destino = path.join(UPLOAD_DIR, "patrimonios"); 
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
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-zA-Z0-9.\-_() ]/g, "") 
      .replace(/\s+/g, "_"); 

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

// 🛑 CORRECCIÓN CLAVE 1: Exportar con nombre (uploader) en lugar de default
export const uploader = multer({ storage, fileFilter });

// Si tenías un 'export default upload', debes eliminarlo.