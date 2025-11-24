import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 👤 Testimonios con fotos (puedes reemplazar las imágenes por las reales)
const testimonios = [
  {
    nombre: "María González",
    texto:
      "Visitar la Fábrica Textil Bellavista fue como viajar en el tiempo. Es increíble cómo Tomé conserva su historia.",
    foto: "/assets/images/visitor1.webp",
  },
  {
    nombre: "Carlos Pérez",
    texto:
      "Las caletas y playas son maravillosas. La gente es muy acogedora y se siente la identidad local en cada rincón.",
    foto: "/assets/images/visitor2.webp",
  },
  {
    nombre: "Ana Torres",
    texto:
      "Me encantó recorrer los patrimonios culturales. Es un proyecto que realmente conecta a turistas con la comunidad.",
    foto: "/assets/images/visitor3.webp",
  },
];

const TestimonialsWithImages = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonios.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonios.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonios.length) % testimonios.length);

  return (
    <section className="bg-[#f5f7f2] py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto text-center relative">
        <h2 className="text-3xl font-bold text-[#2A624C] mb-8">Testimonios de Visitantes</h2>

        {/* Testimonio actual */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white shadow-lg rounded-xl p-8 transition-all duration-700">
          {/* Foto */}
          <img
            src={testimonios[current].foto}
            alt={testimonios[current].nombre}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#2A624C]/40 shadow-md"
          />

          {/* Texto */}
          <div className="text-left md:text-center flex-1">
            <p className="text-gray-700 italic mb-6">“{testimonios[current].texto}”</p>
            <h3 className="text-lg font-semibold text-[#2A624C]">
              — {testimonios[current].nombre}
            </h3>
          </div>
        </div>

        {/* Botones navegación */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="p-2 bg-[#2A624C]/20 hover:bg-[#2A624C]/40 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-[#2A624C]" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="p-2 bg-[#2A624C]/20 hover:bg-[#2A624C]/40 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-[#2A624C]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsWithImages;
