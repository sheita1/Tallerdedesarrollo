let TOURISTA_BASE_URL;

if (process.env.NODE_ENV === "production") {
  // ✅ Servidor del Profesor (Puerto del Frontend Turista 1555)
  TOURISTA_BASE_URL = "http://146.83.194.168:1555";
} else {
  // Desarrollo / Fallback
  TOURISTA_BASE_URL = "http://localhost:1555";
}

export { TOURISTA_BASE_URL };