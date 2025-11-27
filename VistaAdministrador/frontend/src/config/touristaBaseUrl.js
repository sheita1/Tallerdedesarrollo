let TOURISTA_BASE_URL;

if (process.env.NODE_ENV === "production") {
  // ✅ Producción: servidor institucional detrás de Apache en puerto 1555 (HTTP)
  TOURISTA_BASE_URL = "http://146.83.198.35:1555";
} else {
  // ✅ Desarrollo: tu IP local o localhost
  TOURISTA_BASE_URL = "http://172.20.10.2:8080";
}

export { TOURISTA_BASE_URL };
