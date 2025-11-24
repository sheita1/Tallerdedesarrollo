import { useState } from "react";
import "@styles/ModalSubirImagenes.css";

function ModalSubirImagenes({ patrimonioId, onClose, onUploadSuccess }) {
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter(file => file.type === "image/png");
    setImagenes(valid);
    setMensaje(valid.length < files.length ? "❌ Algunos archivos fueron ignorados (solo PNG)." : "");
    console.log("📁 Archivos seleccionados:", valid.map(f => f.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagenes.length === 0) return;

    const formData = new FormData();
    imagenes.forEach((img) => formData.append("imagenes", img));

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const endpoint = `${baseURL}/api/patrimonios/imagenes/${patrimonioId}`;

    console.log("📤 Enviando múltiples imágenes a:", endpoint);
    setSubiendo(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log("📥 Respuesta del servidor:", res.status);
      console.log("📦 Datos recibidos:", data);

      if (res.ok && data.imagenes) {
        setMensaje(`✅ ${data.imagenes.length} imágenes subidas correctamente.`);
        setImagenes([]);
        if (onUploadSuccess) onUploadSuccess(); // ✅ recarga galería
      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudo subir las imágenes."}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      setMensaje("❌ Error de conexión con el servidor.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📎 Subir múltiples imágenes PNG</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/png" multiple onChange={handleFileChange} />
          <button type="submit" disabled={imagenes.length === 0 || subiendo}>
            {subiendo ? "Subiendo..." : "Subir"}
          </button>
          <button type="button" onClick={onClose}>Cerrar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}

export default ModalSubirImagenes;
  