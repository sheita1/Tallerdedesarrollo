import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: true,        // ✅ permite acceso desde celular
    port: 8080,        // ✅ puerto del turista
    proxy: {
      "/api": {
        target: "http://localhost:3000", // ✅ backend real
        changeOrigin: true,
        secure: false,
      },
      "/patrimonios": {
        target: "http://localhost:3000", // ✅ imágenes de patrimonios
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:3000", // ✅ imágenes generales
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
