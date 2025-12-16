import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function QRInstitucional({ id, nombre, logo }) {
  
  // ✅ FIX: Ruta correcta (/turista/patrimonio/ID) y Origen Dinámico
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // AQUÍ ESTABA EL ERROR DE RUTA:
  const url = `${baseUrl}/turista/patrimonio/${id}`;

  const descargarPDF = async () => {
    const elemento = document.getElementById(`qr-institucional-${id}`);
    if (!elemento) return;

    const canvas = await html2canvas(elemento, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "letter",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 40, 40, imgWidth, imgHeight);
    pdf.save(`QR_Patrimonio_${id}.pdf`);
  };

  return (
    <div>
      <div
        id={`qr-institucional-${id}`}
        style={{
          width: "500px",
          padding: "20px",
          border: "3px solid #003366",
          borderRadius: "12px",
          textAlign: "center",
          background: "white",
          fontFamily: "Arial",
        }}
      >
        <img
          src={logo}
          alt="Logo municipal"
          style={{ width: "90px", marginBottom: "10px" }}
        />
        <h2 style={{ margin: "0", color: "#003366" }}>
          Patrimonio #{id}
        </h2>
        <p style={{ fontSize: "18px", marginTop: "5px" }}>
          <strong>{nombre}</strong>
        </p>

        <div style={{ position: "relative", display: "inline-block" }}>
          <QRCodeCanvas
            id={`qr-canvas-${id}`}
            value={url} 
            size={260}
            includeMargin={true}
            style={{ borderRadius: "8px" }}
          />
          <img
            src={logo}
            alt="logo"
            style={{
              width: "60px",
              height: "60px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px",
            }}
          />
        </div>
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#444" }}>
          Escanea este código para ver la información completa del patrimonio.
        </p>
      </div>

      <button
        onClick={descargarPDF}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "#003366",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        📄 Descargar QR institucional (PDF)
      </button>
    </div>
  );
}

export default QRInstitucional;