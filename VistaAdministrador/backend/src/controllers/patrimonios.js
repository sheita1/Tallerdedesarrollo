import { AppDataSource } from "../config/configDb.js";
import Patrimonio from "../entity/patrimonio.entity.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js";

export const subirImagenPatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "No se recibió imagen válida" });
    }

    const rutaRelativa = `patrimonios/${archivo.filename}`;

    console.log("📥 [subirImagenPatrimonio] ID recibido:", id);
    console.log("📦 [subirImagenPatrimonio] Imagen guardada como:", rutaRelativa);

    const patrimonioRepo = AppDataSource.getRepository(Patrimonio);
    const patrimonio = await patrimonioRepo.findOne({ where: { id: parseInt(id) } });

    if (!patrimonio) {
      return res.status(404).json({ error: "Patrimonio no encontrado" });
    }

    patrimonio.imagen = rutaRelativa;
    await patrimonioRepo.save(patrimonio);

    res.status(200).json({
      mensaje: "Imagen subida correctamente",
      imagen: rutaRelativa,
    });
  } catch (error) {
    console.error("❌ Error en subirImagenPatrimonio:", error);
    res.status(500).json({
      error: "Error al subir imagen",
      detalle: error.message,
    });
  }
};

export const subirImagenesPatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const archivos = req.files;

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: "No se recibieron imágenes válidas" });
    }

    const patrimonioRepo = AppDataSource.getRepository(Patrimonio);
    const imagenRepo = AppDataSource.getRepository(PatrimonioImagen);

    const patrimonio = await patrimonioRepo.findOne({ where: { id: parseInt(id) } });
    if (!patrimonio) {
      return res.status(404).json({ error: "Patrimonio no encontrado" });
    }

    const rutasRelativas = archivos.map((archivo) => `patrimonios/${archivo.filename}`);

    const registros = rutasRelativas.map((ruta) =>
      imagenRepo.create({
        ruta,
        patrimonioId: patrimonio.id,
      })
    );

    await imagenRepo.save(registros);

    console.log("📥 [subirImagenesPatrimonio] ID recibido:", id);
    console.log("📦 [subirImagenesPatrimonio] Imágenes registradas:", rutasRelativas);

    res.status(200).json({
      mensaje: "Imágenes subidas correctamente",
      imagenes: rutasRelativas,
    });
  } catch (error) {
    console.error("❌ Error en subirImagenesPatrimonio:", error);
    res.status(500).json({
      error: "Error al subir imágenes",
      detalle: error.message,
    });
  }
};

export const obtenerImagenesPatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const imagenRepo = AppDataSource.getRepository(PatrimonioImagen);

    const imagenes = await imagenRepo.find({
      where: { patrimonioId: parseInt(id) },
      order: { fechaSubida: "DESC" },
    });

    console.log("🔍 [obtenerImagenesPatrimonio] ID:", id);
    console.log("📸 [obtenerImagenesPatrimonio] Total imágenes:", imagenes.length);

    res.status(200).json(imagenes);
  } catch (error) {
    console.error("❌ Error en obtenerImagenesPatrimonio:", error);
    res.status(500).json({
      error: "Error al obtener imágenes",
      detalle: error.message,
    });
  }
};
