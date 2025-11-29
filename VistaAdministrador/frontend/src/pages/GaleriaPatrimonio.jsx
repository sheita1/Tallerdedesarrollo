import { useEffect, useState } from "react";
import instance from "@services/root.service"; 
import '@styles/GaleriaPatrimonio.css';

function GaleriaPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombrePatrimonio, setNombrePatrimonio] = useState("");

  // Cargar imágenes
  useEffect(() => {
    instance.get(`/patrimonios/imagenes/${patrimonioId}`)
      .then((res) => {
        setImagenes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("💥 Error al cargar imágenes:", err);
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
    formData.append("imagenes", archivo);

    try {
      const res = await instance.post(`/patrimonios/imagenes/${patrimonioId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const respuesta = res.data;
      const nuevas = Array.isArray(respuesta) ? respuesta : [respuesta];
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
              <img
                src={`/api/${img.ruta}`}   {/* ✅ ya no usa localhost */}
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
          <img
            src={`/api/${imagenAmpliada.ruta}`}  {/* ✅ corregido */}
            alt="Imagen ampliada"
            className="galeria-ampliada"
          />
        </div>
      )}
    </div>
  );
}

export default GaleriaPatrimonio;
