import { useEffect, useState } from "react";
import instance from "@services/root.service"; 
import '@styles/GaleriaPatrimonio.css';

function GaleriaPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombrePatrimonio, setNombrePatrimonio] = useState("");

  // 🚨 CONFIGURACIÓN: Puerto 1556
  const URL_BACKEND = "http://146.83.198.35:1556";

  // Función para construir la URL correctamente
  const getImagenUrl = (img) => {
    const nombreArchivo = img.fileName || img.ruta || img.url;
    if (!nombreArchivo) return "";
    
    if (nombreArchivo.startsWith("http")) return nombreArchivo;

    // 🚨 Usamos la ruta de emergencia del backend
    return `${URL_BACKEND}/imagen-emergencia/${nombreArchivo}`; 
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
        console.error("💥 Error al obtener nombre:", err);
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
        <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} />
        <button type="submit">📤 Subir imagen</button>
      </form>

      {imagenes.length > 0 ? (
        <div className="galeria-grid">
          {imagenes.map((img) => (
            <div key={img.id} className="galeria-item">
              {/* 🚨 MODIFICACIÓN: Eliminamos el onError para ver el error 404/ícono */}
              <img
                src={getImagenUrl(img)}
                alt={`Imagen ${img.id}`}
                onClick={() => setImagenAmpliada(img)}
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
          {/* 🚨 MODIFICACIÓN: Eliminamos el onError aquí también */}
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