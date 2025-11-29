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
    const baseURL = import.meta.env.VITE_BASE_URL || "/api";
    const fetchPatrimonio = async () => {
      try {
        const res = await fetch(`${baseURL}/patrimonios/detail/?id=${patrimonioId}`);
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

  // URL pública para QR (defínela en .env.production como VITE_PUBLIC_URL=http://146.83.198.35:1555)
  const publicURL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

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
          {/* ✅ Usar directamente la ruta pública que devuelve el backend */}
          <img
            src={patrimonio.imagen}
            alt="Imagen principal"
            style={{ maxWidth: "400px", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* ✅ QR dinámico con URL pública */}
      <div style={{ marginTop: "2rem" }}>
        <h3>📱 QR para imprimir</h3>
        <QrConLogo
          url={`${publicURL}/patrimonio/${patrimonioId}`}
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
