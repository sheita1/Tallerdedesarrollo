// VistaTurista/src/utils/touristaBaseUrl.js - CÓDIGO FINAL

let TOURISTA_BASE_URL;


if (import.meta.env.DEV) {
  // En desarrollo, usamos la URL de Vite
  TOURISTA_BASE_URL = window.location.origin;
}


else {
  // 🚨 CORRECCIÓN: Usamos la URL de origen del servidor Express (http://[IP_SERVIDOR]:1556)
  TOURISTA_BASE_URL = window.location.origin;
}

export { TOURISTA_BASE_URL };