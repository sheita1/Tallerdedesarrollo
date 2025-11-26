import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GaleriaPatrimonio from "../pages/GaleriaPatrimonio";

// ✅ Función para registrar escaneo QR
const registrarEscaneo = async (patrimonioId) => {
  try {
    await fetch("http://localhost:3000/api/qr/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patrimonioId }),
    });
  } catch (error) {
    console.error("Error registrando escaneo QR:", error);
  }
};

function DetallePatrimonio() {
  const { id } = useParams(); 
  const [patrimonio, setPatrimonio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    registrarEscaneo(id);

    fetch(`http://localhost:3000/api/patrimonios/detail/?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatrimonio(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar patrimonio:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando patrimonio...</p>;
  if (!patrimonio) return <p>No se encontró el patrimonio.</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>{patrimonio.nombre}</h2>
      <p><strong>Ubicación:</strong> {patrimonio.ubicacion}</p>
      <p><strong>Tipo:</strong> {patrimonio.tipo}</p>
      <p><strong>Descripción:</strong> {patrimonio.descripcion}</p>

      <div style={{ marginTop: "2rem" }}>
        <h3>📷 Imagen registrada:</h3>
        {patrimonio.imagen ? (
          <img
            src={`http://localhost:3000/uploads/${patrimonio.imagen}`}
            alt="Imagen del patrimonio"
            style={{ maxWidth: "100%", borderRadius: "4px", marginTop: "1rem" }}
          />
        ) : (
          <p style={{ color: "#888" }}>No hay imagen registrada.</p>
        )}
      </div>

      <div style={{ marginTop: "3rem" }}>
        <GaleriaPatrimonio patrimonioId={patrimonio.id} />
      </div>
    </div>
  );
}

export default DetallePatrimonio;
