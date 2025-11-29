import { useEffect, useState } from "react";

function GaleriaImagenes({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL || "/api";
        const res = await fetch(`${baseURL}/patrimonios/imagenes/${patrimonioId}`);
        const data = await res.json();
        setImagenes(data);
      } catch (error) {
        console.error("❌ Error al cargar imágenes:", error);
      } finally {
        setCargando(false);
      }
    };

    if (patrimonioId) fetchImagenes();
  }, [patrimonioId]);

  if (cargando) return <p>Cargando galería...</p>;
  if (imagenes.length === 0) return <p>No hay imágenes adicionales registradas.</p>;

  return (
    <div>
      <h3>📸 Galería de imágenes</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        {imagenes.map((img) => (
          <div key={img.id} style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}>
            <img
              src={`/uploads/${img.ruta}`}
              alt={`Imagen ${img.id}`}
              style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "4px" }}
            />
            <small style={{ display: "block", marginTop: "4px", color: "#666" }}>
              Subida: {new Date(img.fechaSubida).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GaleriaImagenes;
