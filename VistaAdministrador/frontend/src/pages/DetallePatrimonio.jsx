import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GaleriaPatrimonio from "../pages/GaleriaPatrimonio";

const BASE_URL = import.meta.env.VITE_BASE_URL || "/api";
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

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
  const { id } = useParams();
  const [patrimonio, setPatrimonio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setPatrimonio(data.data || data);
      } catch (err) {
        console.error("Error al cargar patrimonio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (loading) return <p>Cargando patrimonio...</p>;

  const patrimonioData = patrimonio?.data || patrimonio;
  if (!patrimonioData || !patrimonioData.nombre)
    return <p>No se encontró el patrimonio.</p>;

  // ✅ Construcción segura de la imagen principal
  let imagenSrc = null;

  if (patrimonioData?.imagen) {
    if (patrimonioData.imagen.startsWith("http")) {
      imagenSrc = patrimonioData.imagen;
    } else {
      imagenSrc = `${PUBLIC_URL}${patrimonioData.imagen}`;
    }
  } else {
    console.warn("⚠️ Patrimonio sin imagen principal:", patrimonioData);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>{patrimonioData.nombre}</h2>
      <p><strong>Ubicación:</strong> {patrimonioData.ubicacion}</p>
      <p><strong>Tipo:</strong> {patrimonioData.tipo}</p>
      <p><strong>Descripción:</strong> {patrimonioData.descripcion}</p>

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
        <GaleriaPatrimonio patrimonioId={id} />
      </div>
    </div>
  );
}

export default DetallePatrimonio;
