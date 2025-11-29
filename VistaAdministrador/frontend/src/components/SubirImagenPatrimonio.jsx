import { useState } from "react";

function SubirImagenesPatrimonio({ patrimonioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("📁 Archivos seleccionados:", files);

    const validFiles = files.filter((file) => file.type === "image/png");

    if (validFiles.length > 0) {
      setImagenes(validFiles);
      setPreviews(validFiles.map((file) => URL.createObjectURL(file)));
      setMensaje("");
    } else {
      setImagenes([]);
      setPreviews([]);
      setMensaje("❌ Solo se permiten imágenes PNG.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagenes.length === 0) {
      console.log("⚠️ No hay imágenes seleccionadas");
      return;
    }

    const formData = new FormData();
    imagenes.forEach((img) => formData.append("imagenes", img));

    console.log("📤 Enviando imágenes para patrimonio ID:", patrimonioId);

    try {
      const baseURL = import.meta.env.VITE_BASE_URL || "/api";
      const res = await fetch(`${baseURL}/patrimonios/imagenes/${patrimonioId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("📥 Respuesta del servidor:", res.status);
      const data = await res.json();
      console.log("📦 Datos recibidos:", data);

      if (res.ok && data.imagenes) {
        // ✅ Ya vienen con /uploads/patrimonios/...
        setMensaje("✅ Imágenes subidas correctamente.");
        setPreviews(data.imagenes);
      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudieron subir las imágenes."}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h3 style={{ marginBottom: "1rem" }}>📎 Adjuntar múltiples imágenes PNG</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/png"
          multiple
          onChange={handleFileChange}
          style={{
            display: "block",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            padding: "0.5rem",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          disabled={imagenes.length === 0}
          style={{
            backgroundColor: "#004080",
            color: "#fff",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Subir imágenes
        </button>
      </form>

      {mensaje && <p style={{ marginTop: "1rem", color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>}

      {previews.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p>📷 Vista previa:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {previews.map((src, idx) => (
              <img key={idx} src={src} alt={`Vista previa ${idx}`} style={{ maxWidth: "150px", borderRadius: "4px" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubirImagenesPatrimonio;
