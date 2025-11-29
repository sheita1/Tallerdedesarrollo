import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 👈 importante
import GaleriaImagenes from "./GaleriaImagenes";
import ModalSubirImagenes from "./ModalSubirImagenes";
import QrConLogo from "./QrConLogo";
import logoMunicipal from "../assets/logo.png";

function DetallePatrimonio({ patrimonioId: propId }) {
  const { id } = useParams(); // obtiene el id de la URL
  const patrimonioId = propId ?? id; // usa prop si existe, si no usa el id de la URL

  console.log("🟢 patrimonioId final:", patrimonioId);

  const [patrimonio, setPatrimonio] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [recargarGaleria, setRecargarGaleria] = useState(false);

  useEffect(() => {
    if (!patrimonioId) {
      console.error("⚠️ patrimonioId no definido en DetallePatrimonio.jsx");
      return;
    }
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

  const handleRecargarGaleria = () => setRecargarGaleria((prev) => !prev);

  if (!patrimonioId) return <p>Error: patrimonioId no válido.</p>;
  if (!patrimonio) return <p>Cargando patrimonio...</p>;

  const publicURL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

  return (
    <div className="detalle-patrimonio" style={{ padding: "1rem" }}>
      <h2>{patrimonio.nombre}</h2>
      {/* resto igual */}
      <GaleriaImagenes patrimonioId={patrimonioId} key={recargarGaleria} />
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
gi