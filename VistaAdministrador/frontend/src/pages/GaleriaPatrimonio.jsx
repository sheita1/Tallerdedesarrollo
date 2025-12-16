import { useEffect, useState } from "react";
import instance from "@services/root.service"; 
import '@styles/GaleriaPatrimonio.css';

function GaleriaPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombrePatrimonio, setNombrePatrimonio] = useState("");

  // ⚠️ CONFIGURACIÓN: URL directa del backend
  // Si las imágenes no cargan, prueba agregando "/uploads" al final: "http://146.83.198.35:1555/uploads"
  const URL_BACKEND = "http://146.83.198.35:1555";

  // Cargar imágenes
  useEffect(() => {
    instance.get(`/patrimonios/imagenes/patrimonio/${patrimonioId}`)
      .then((res) => {
        const data = res.data;
        // Si el backend devuelve { data: [...] }, lo manejamos aquí
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

      // 🔧 CORRECCIÓN: Accedemos a la propiedad 'data' del JSON de respuesta
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
              {/* 🔧 CORRECCIÓN: Usamos fileName en lugar de ruta */}
              <img
                src={`${URL_BACKEND}/${img.fileName}`}
                alt={`Imagen ${img.id}`}
                onClick={() => setImagenAmpliada(img)}
                onError={(e) => {
                    // Fallback por si falta la carpeta 'uploads'
                    if (!e.target.src.includes("/uploads/")) {
                        e.target.src = `${URL_BACKEND}/uploads/${img.fileName}`;
                    }
                }}
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
            src={`${URL_BACKEND}/${imagenAmpliada.fileName}`}
            alt="Imagen ampliada"
            className="galeria-ampliada"
          />
        </div>
      )}
    </div>
  );
}

export default GaleriaPatrimonio;