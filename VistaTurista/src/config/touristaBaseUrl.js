// VistaTurista/src/utils/touristaBaseUrl.js - CÓDIGO FINAL

let TOURISTA_BASE_URL;

// ✅ Modo desarrollo (npm run dev)
if (import.meta.env.DEV) {
  // En desarrollo, usamos la URL de Vite
  TOURISTA_BASE_URL = window.location.origin;
}

// ✅ Modo producción (npm run build)
else {
  // 🚨 CORRECCIÓN: Usamos la URL de origen del servidor Express (http://[IP_SERVIDOR]:1556)
  TOURISTA_BASE_URL = window.location.origin;
}

export { TOURISTA_BASE_URL };