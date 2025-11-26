import { useEffect, useState } from "react";
import GaleriaImagenes from "./GaleriaImagenes";
import ModalSubirImagenes from "./ModalSubirImagenes";


import QrConLogo from "./QrConLogo";
import logoMunicipal from "../assets/logo.png";

function DetallePatrimonio({ patrimonioId }) {
  const [patrimonio, setPatrimonio] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [recargarGaleria, setRecargarGaleria] = useState(false);

  useEffect(() => {
    const fetchPatrimonio = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${baseURL}/api/patrimonios/detail/?id=${patrimonioId}`);
        const data = await res.json();
        setPatrimonio(data);
      } catch (error) {
        console.error("❌ Error al cargar patrimonio:", error);
      }
    };

    fetchPatrimonio();
  }, [patrimonioId]);

  const handleRecargarGaleria = () => {
    setRecargarGaleria((prev) => !prev);
  };

  if (!patrimonio) return <p>Cargando patrimonio...</p>;

  return (
    <div className="detalle-patrimonio" style={{ padding: "1rem" }}>
      <h2>{patrimonio.nombre}</h2>
      <p><strong>Ubicación:</strong> {patrimonio.ubicacion}</p>
      <p><strong>Tipo:</strong> {patrimonio.tipo}</p>
      <p><strong>Estado:</strong> {patrimonio.estado}</p>
      <p><strong>Descripción:</strong> {patrimonio.descripcion}</p>

      {patrimonio.imagen && (
        <div style={{ marginTop: "1rem" }}>
          <h3>🖼️ Imagen principal</h3>
          <img
            src={`/uploads/${patrimonio.imagen}`}
            alt="Imagen principal"
            style={{ maxWidth: "400px", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* ✅ QR con logo y botón de descarga */}
      <div style={{ marginTop: "2rem" }}>
        <h3>📱 QR para imprimir</h3>
        <QrConLogo
          url={`http://localhost:8080/patrimonio/${patrimonioId}`}
          logo={logoMunicipal}
        />
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <GaleriaImagenes patrimonioId={patrimonioId} key={recargarGaleria} />

      <button onClick={() => setMostrarModal(true)} style={{ marginTop: "1rem" }}>
        📤 Subir nuevas imágenes PNG
      </button>

      {mostrarModal && (
        <ModalSubirImagenes
          patrimonioId={patrimonioId}
          onClose={() => setMostrarModal(false)}
          onUploadSuccess={handleRecargarGaleria}
        />
      )}
    </div>
  );
}

export default DetallePatrimonio;
