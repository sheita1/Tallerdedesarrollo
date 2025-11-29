import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GaleriaPatrimonio from "../pages/GaleriaPatrimonio";

// 🔧 Base URLs (defínelas en .env)
const BASE_URL = import.meta.env.VITE_BASE_URL || "/api";
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

// ✅ Función para registrar escaneo QR en backend correcto
const registrarEscaneo = async (patrimonioId) => {
  if (!patrimonioId) {
    console.warn("⚠️ registrarEscaneo: patrimonioId inválido");
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/qr/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patrimonioId }),
    });
    if (!res.ok) {
      console.warn("⚠️ registrarEscaneo: respuesta no OK", res.status);
    }
  } catch (error) {
    console.error("Error registrando escaneo QR:", error);
  }
};

function DetallePatrimonio() {
  const { id } = useParams(); // id desde /patrimonio/:id
  const [patrimonio, setPatrimonio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🟢 useParams id:", id);
    if (!id) {
      console.error("⚠️ id no definido en DetallePatrimonio (useParams)");
      setLoading(false);
      return;
    }

    registrarEscaneo(id);

    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${BASE_URL}/patrimonios/detail/?id=${id}`);
        const data = await res.json();
        console.log("🟢 Detalle patrimonio recibido:", data);
        setPatrimonio(data);
      } catch (err) {
        console.error("Error al cargar patrimonio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (loading) return <p>Cargando patrimonio...</p>;
  if (!patrimonio) return <p>No se encontró el patrimonio.</p>;

  // 🔧 Construcción de URL de imagen pública
  // Si Apache tiene Alias /uploads, puedes usar `${PUBLIC_URL}/uploads/...`
  const imagenSrc = patrimonio.imagen
    ? `${PUBLIC_URL}/uploads/${patrimonio.imagen}`
    : null;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>{patrimonio.nombre}</h2>
      <p><strong>Ubicación:</strong> {patrimonio.ubicacion}</p>
      <p><strong>Tipo:</strong> {patrimonio.tipo}</p>
      <p><strong>Descripción:</strong> {patrimonio.descripcion}</p>

      <div style={{ marginTop: "2rem" }}>
        <h3>📷 Imagen registrada:</h3>
        {imagenSrc ? (
          <img
            src={imagenSrc}
            alt="Imagen del patrimonio"
            style={{ maxWidth: "100%", borderRadius: "4px", marginTop: "1rem" }}
          />
        ) : (
          <p style={{ color: "#888" }}>No hay imagen registrada.</p>
        )}
      </div>

      <div style={{ marginTop: "3rem" }}>
        {/* Usa el id que ya validamos */}
        <GaleriaPatrimonio patrimonioId={id} />
      </div>
    </div>
  );
}

export default DetallePatrimonio;
