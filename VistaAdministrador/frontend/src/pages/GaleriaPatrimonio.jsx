import { useEffect, useState } from "react";
import '@styles/GaleriaPatrimonio.css';

function GaleriaPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombrePatrimonio, setNombrePatrimonio] = useState("");

  // Cargar imágenes
  useEffect(() => {
    fetch(`http://localhost:3000/api/patrimonios/imagenes/${patrimonioId}`)
      .then((res) => res.json())
      .then((data) => {
        setImagenes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("💥 Error al cargar imágenes:", err);
        setLoading(false);
      });
  }, [patrimonioId]);

  // Cargar nombre del patrimonio
  useEffect(() => {
    fetch(`http://localhost:3000/api/patrimonios/${patrimonioId}`)
      .then((res) => res.json())
      .then((data) => {
        setNombrePatrimonio(data.nombre || `#${patrimonioId}`);
      })
      .catch((err) => {
        console.error("💥 Error al obtener nombre del patrimonio:", err);
        setNombrePatrimonio(`#${patrimonioId}`);
      });
  }, [patrimonioId]);

  const handleEliminar = async (idImagen) => {
    try {
      const response = await fetch(`http://localhost:3000/api/imagenes/${idImagen}`, {
        method: "DELETE",
      });

      if (response.ok) {
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
      const res = await fetch(`http://localhost:3000/api/patrimonios/imagenes/${patrimonioId}`, {
        method: "POST",
        body: formData,
      });

      const respuesta = await res.json();
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
                src={`http://localhost:3000/${img.ruta}`}
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
            src={`http://localhost:3000/${imagenAmpliada.ruta}`}
            alt="Imagen ampliada"
            className="galeria-ampliada"
          />
        </div>
      )}
    </div>
  );
}

export default GaleriaPatrimonio;
