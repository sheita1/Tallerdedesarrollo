let TOURISTA_BASE_URL;

if (process.env.NODE_ENV === "production") {
  // ✅ Producción (Modificado para Docker Desktop):
  // Usamos localhost porque estás corriendo el contenedor en tu máquina.
  TOURISTA_BASE_URL = "http://localhost:1555";
} else {
  // ✅ Desarrollo: También localhost para evitar problemas de IP
  TOURISTA_BASE_URL = "http://localhost:1555";
}

export { TOURISTA_BASE_URL };