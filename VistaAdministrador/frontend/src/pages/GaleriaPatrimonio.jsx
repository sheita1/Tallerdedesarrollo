import { useEffect, useState } from "react";
import instance from "@services/root.service"; 
import '@styles/GaleriaPatrimonio.css';

function GaleriaPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombrePatrimonio, setNombrePatrimonio] = useState("");

  // ⚠️ URL del Backend (IP del servidor)
  const URL_BACKEND = "http://146.83.198.35:1555";

  // 🔧 FUNCIÓN INTELIGENTE PARA GENERAR LA URL
  const getImagenUrl = (img) => {
    // 1. Detectar si viene como 'fileName', 'ruta', 'url' o 'path'
    const nombreArchivo = img.fileName || img.ruta || img.url || img.path;

    if (!nombreArchivo) return ""; // Si no hay nombre, retorna vacío

    // 2. Si ya incluye 'http', es una URL completa, la usamos tal cual
    if (nombreArchivo.startsWith("http")) return nombreArchivo;

    // 3. Si el nombre ya incluye 'uploads/', solo le pegamos la IP
    if (nombreArchivo.includes("uploads/")) {
      return `${URL_BACKEND}/${nombreArchivo}`;
    }

    // 4. Si es solo el nombre del archivo (ej: 'foto.png'), le agregamos '/uploads/'
    return `${URL_BACKEND}/uploads/${nombreArchivo}`;
  };

  // Cargar imágenes
  useEffect(() => {
    instance.get(`/patrimonios/imagenes/patrimonio/${patrimonioId}`)
      .then((res) => {
        const data = res.data;
        const listaImagenes = data.data || data; 
        setImagenes(Array.isArray(listaImagenes) ? listaImagenes : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("💥 Error al cargar imágenes:", err);
        setImagenes([]);
        setLoading(false);
      });
  }, [patrimonioId]);

  // Cargar nombre del patrimonio
  useEffect(() => {
    instance.get(`/patrimonios/detail/?id=${patrimonioId}`)
      .then((res) => {
        setNombrePatrimonio(res.data.nombre || `#${patrimonioId}`);
      })
      .catch((err) => {
        console.error("💥 Error al obtener nombre del patrimonio:", err);
        setNombrePatrimonio(`#${patrimonioId}`);
      });
  }, [patrimonioId]);

  const handleEliminar = async (idImagen) => {
    try {
      const response = await instance.delete(`/imagenes/${idImagen}`);
      if (response.status === 200) {
        setImagenes((prev) => prev.filter((img) => img.id !== idImagen));
      }
    } catch (err) {
      console.error("💥 Error al eliminar imagen:", err);
    }
  };

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!archivo) return;

    const formData = new FormData();
    formData.append("imagen", archivo);

    try {
      const res = await instance.post(`/patrimonios/imagenes/${patrimonioId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const respuesta = res.data; 
      // El backend devuelve { data: {...} } en el upload
      const imagenNueva = respuesta.data || respuesta; 

      const nuevas = Array.isArray(imagenNueva) ? imagenNueva : [imagenNueva];
      setImagenes((prev) => [...prev, ...nuevas]);
      setArchivo(null);
    } catch (err) {
      console.error("💥 Error al subir imagen:", err);
    }
  };

  if (loading) return <p>Cargando galería...</p>;

  return (
    <div className="galeria-container">
      <h2>🖼️ Galería del Patrimonio {nombrePatrimonio}</h2>

      <form onSubmit={handleSubir} className="galeria-formulario">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivo(e.target.files[0])}
        />
        <button type="submit">📤 Subir imagen</button>
      </form>

      {imagenes.length > 0 ? (
        <div className="galeria-grid">
          {imagenes.map((img) => (
            <div key={img.id} className="galeria-item">
              {/* USAMOS LA FUNCIÓN INTELIGENTE AQUÍ */}
              <img
                src={getImagenUrl(img)}
                alt={`Imagen ${img.id}`}
                onClick={() => setImagenAmpliada(img)}
                onError={(e) => { e.target.style.display = 'none'; }} // Oculta si falla
              />
              <button onClick={() => handleEliminar(img.id)}>🗑️</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay imágenes registradas.</p>
      )}

      {imagenAmpliada && (
        <div className="galeria-overlay" onClick={() => setImagenAmpliada(null)}>
          <img
            src={getImagenUrl(imagenAmpliada)}
            alt="Imagen ampliada"
            className="galeria-ampliada"
          />
        </div>
      )}
    </div>
  );
}

export default GaleriaPatrimonio;