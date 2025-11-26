// src/config/touristaBaseUrl.js

let TOURISTA_BASE_URL;

if (process.env.NODE_ENV === "production") {
  // ✅ Producción: servidor institucional detrás de Apache HTTPS
  TOURISTA_BASE_URL = "https://146.83.198.35:1556";
} else {
  // ✅ Desarrollo: tu IP local o localhost
  // Cambia esta IP si usas otra red o dispositivo
  TOURISTA_BASE_URL = "http://172.20.10.2:8080";
}

export { TOURISTA_BASE_URL };
