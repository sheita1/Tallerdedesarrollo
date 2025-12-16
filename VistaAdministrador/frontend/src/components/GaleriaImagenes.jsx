import { useEffect, useState } from "react";

function GaleriaImagenes({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        // Usamos la URL base dinámica o fallback a /api
        const baseURL = import.meta.env.VITE_BASE_URL || "/api";
        const res = await fetch(`${baseURL}/patrimonios/imagenes/patrimonio/${patrimonioId}`);
        const data = await res.json();
        setImagenes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error al cargar imágenes:", error);
        setImagenes([]);
      } finally {
        setCargando(false);
      }
    };

    if (patrimonioId) fetchImagenes();
  }, [patrimonioId]);

  if (cargando) return <p>Cargando galería...</p>;
  if (imagenes.length === 0) return <p>No hay imágenes adicionales registradas.</p>;

  // ✅ DEFINIMOS LA URL BASE UNIVERSAL (Localhost o IP Servidor)
  const serverUrl = window.location.origin;

  return (
    <div>
      <h3>📸 Galería de imágenes</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        {imagenes.map((img) => {
          
          // 🔧 CORRECCIÓN CRÍTICA:
          // 1. Usamos serverUrl (http://146.83...)
          // 2. Apuntamos a la carpeta "/uploads/" (NO a /api)
          const rutaFinal = img.ruta 
            ? `${serverUrl}/uploads/${img.ruta}` 
            : "https://via.placeholder.com/300?text=Sin+Imagen";

          return (
            <div key={img.id} style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}>
              <img
                src={rutaFinal} // ✅ Usamos la ruta corregida
                alt={`Imagen ${img.id}`}
                style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "4px" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error"; }} // Fallback si falla
              />
              <small style={{ display: "block", marginTop: "4px", color: "#666" }}>
                Subida: {img.fechaSubida ? new Date(img.fechaSubida).toLocaleDateString() : "-"}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GaleriaImagenes;