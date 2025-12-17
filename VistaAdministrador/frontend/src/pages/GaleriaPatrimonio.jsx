import { useEffect, useState } from "react";
import instance from "@services/root.service"; 
import '@styles/GaleriaPatrimonio.css';

function GaleriaPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombrePatrimonio, setNombrePatrimonio] = useState("");

  // ✅ ÚNICO CAMBIO REALIZADO: IP DEL SERVIDOR (Puerto 1556)
  // Forzamos la IP del servidor para asegurar que funcione allá.
  const URL_BACKEND = "http://146.83.194.168:1556";

  // ✅ FUNCIÓN PARA ARMAR URL
  const getImagenUrl = (img) => {
    const rutaCompleta =
      img?.ruta ||
      img?.imagen ||
      img?.url ||
      (img?.fileName ? `/uploads/patrimonios/${img.fileName}` : null);

    if (!rutaCompleta) {
      console.warn("⚠️ Imagen sin ruta válida:", img);
      return "/placeholder.png"; 
    }

    if (rutaCompleta.startsWith("http")) return rutaCompleta;

    return `${URL_BACKEND}${rutaCompleta}`;
  };

  // ✅ Cargar imágenes
  useEffect(() => {
    console.log("🔵 Cargando imágenes para patrimonio:", patrimonioId);

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

  // ✅ Cargar nombre del patrimonio
  useEffect(() => {
    instance.get(`/patrimonios/detail/?id=${patrimonioId}`)
      .then((res) => {
        setNombrePatrimonio(res.data.nombre || `#${patrimonioId}`);
      })
      .catch((err) => {
        console.error("💥 Error al obtener nombre:", err);
      });
  }, [patrimonioId]);

  // ✅ Eliminar imagen
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

  // ✅ Subir imagen
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
      let imagenNueva = respuesta.data || respuesta; 
      
      if (imagenNueva.patrimonioImagen) {
          imagenNueva = imagenNueva.patrimonioImagen;
      }

      if (imagenNueva && !imagenNueva.id) imagenNueva.id = Date.now();

      const nuevas = Array.isArray(imagenNueva) ? imagenNueva : [imagenNueva];
      setImagenes((prev) => [...prev, ...nuevas]);
      setArchivo(null);
      e.target.reset(); 

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
            <div key={img.id || Math.random()} className="galeria-item">
              <img
                src={getImagenUrl(img)}
                alt={`Imagen ${img.id}`}
                onClick={() => setImagenAmpliada(img)}
                onError={(e) => {
                    e.target.src = "/placeholder.png"; 
                }}
              />
              <button onClick={() => handleEliminar(img.id)} className="btn-eliminar">🗑️</button>
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