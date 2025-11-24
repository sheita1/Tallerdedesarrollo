import { useState } from "react";

function SubirImagenPatrimonio({ patrimonioId }) {
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("📁 Archivo seleccionado:", file);

    if (file && file.type === "image/png") {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setMensaje("");
    } else {
      setImagen(null);
      setPreview(null);
      setMensaje("❌ Solo se permiten imágenes PNG.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen) {
      console.log("⚠️ No hay imagen seleccionada");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", imagen);

    console.log("📤 Enviando imagen para patrimonio ID:", patrimonioId);

    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${baseURL}/api/patrimonios/imagen/${patrimonioId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("📥 Respuesta del servidor:", res.status);
      const data = await res.json();
      console.log("📦 Datos recibidos:", data);

      if (res.ok && data.imagen) {
        const rutaFinal = `${baseURL}/uploads/${data.imagen.replace(/\\/g, "/")}`;
        console.log("🖼️ URL pública de imagen:", rutaFinal);
        setMensaje("✅ Imagen subida correctamente.");
        setPreview(rutaFinal);
      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudo subir la imagen."}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h3 style={{ marginBottom: "1rem" }}>📎 Adjuntar imagen PNG</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/png"
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
          disabled={!imagen}
          style={{
            backgroundColor: "#004080",
            color: "#fff",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Subir imagen
        </button>
      </form>

      {mensaje && <p style={{ marginTop: "1rem", color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>}

      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <p>📷 Vista previa:</p>
          <img src={preview} alt="Vista previa" style={{ maxWidth: "100%", borderRadius: "4px" }} />
        </div>
      )}
    </div>
  );
}

export default SubirImagenPatrimonio;
