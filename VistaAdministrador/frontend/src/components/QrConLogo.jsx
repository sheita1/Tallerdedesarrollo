import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QrConLogo = ({ url, logo }) => {
  const canvasRef = useRef(null);

  // ✅ FIX: Extraemos el ID y forzamos la ruta "/turista/patrimonio/"
  let urlFinal = url;
  try {
    // 1. Obtenemos el ID (asumimos que es lo último de la URL recibida)
    // Ej: si llega ".../patrimonio/5", el split saca el "5"
    const partes = url.split('/');
    const id = partes[partes.length - 1]; // Tomamos el último trozo (el ID)

    // 2. Si el ID es válido, armamos la URL correcta
    if (id && !isNaN(parseInt(id))) {
        urlFinal = `${window.location.origin}/turista/patrimonio/${id}`;
    }
  } catch (e) {
    console.log("Error reconstruyendo URL, usando original");
  }

  const descargarQR = () => {
    const canvas = canvasRef.current.querySelector("canvas");
    const enlace = document.createElement("a");
    enlace.download = "qr_patrimonio.png";
    enlace.href = canvas.toDataURL("image/png");
    enlace.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4" style={{ marginTop: "2rem" }}>
      <div
        ref={canvasRef}
        style={{
          position: "relative",
          width: 200,
          height: 200,
          margin: "0 auto",
        }}
      >
        <QRCodeCanvas
          value={urlFinal} // ✅ URL Corregida
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />

        <img
          src={logo}
          alt="logo"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "50px",
            height: "50px",
            transform: "translate(-50%, -50%)",
            borderRadius: "8px",
          }}
        />
      </div>

      <button
        onClick={descargarQR}
        className="bg-[#2A624C] text-white px-4 py-2 rounded hover:bg-[#24523f]"
      >
        Descargar QR
      </button>
      
      {/* Puedes borrar esto luego, es para verificar visualmente */}
      <p style={{fontSize: "10px", color: "#666", marginTop: "5px"}}>
        Link QR: {urlFinal}
      </p>
    </div>
  );
};

export default QrConLogo;