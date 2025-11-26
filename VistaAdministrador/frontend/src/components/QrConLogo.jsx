import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QrConLogo = ({ url, logo }) => {
  const canvasRef = useRef(null);

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
          value={url}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />

        {}
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

      {}
      <button
        onClick={descargarQR}
        className="bg-[#2A624C] text-white px-4 py-2 rounded hover:bg-[#24523f]"
      >
        Descargar QR
      </button>
    </div>
  );
};

export default QrConLogo;
