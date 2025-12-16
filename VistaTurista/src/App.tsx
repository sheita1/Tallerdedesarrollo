import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import DetallePatrimonio from "./pages/DetallePatrimonio";
import Contacto from "./pages/Contacto"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* 🚨 AQUÍ ESTÁ LA SOLUCIÓN: Agregamos basename="/turista" */}
      <BrowserRouter basename="/turista">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Index />} />

          {/* Página dinámica de patrimonio */}
          <Route path="/patrimonio/:id" element={<DetallePatrimonio />} />

          {/* ✅ Nueva página de contacto */}
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;