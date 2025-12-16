import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  // 🚨 CRÍTICO: Esto le dice a Vite que añada '/turista/' a todos los estilos y scripts.
  // Sin esto, el navegador busca en la raíz y falla con el error MIME type.
  base: "/turista/",

  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Nota: La sección 'server' se ignora en Docker (production build),
  // así que la he quitado para limpiar, ya que Express maneja el ruteo ahora.
}));