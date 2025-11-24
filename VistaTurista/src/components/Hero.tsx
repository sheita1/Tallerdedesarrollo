import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Slide1 from '../assets/images/tome2.webp';
import Slide2 from '../assets/images/tome.webp';
import Slide3 from '../assets/images/tome3.webp';

const slides = [
  {
    image: Slide1,
    title: "Descubre el Patrimonio de Tomé",
    description:
      "Explora la historia textil, las caletas de pescadores y los paisajes costeros que dan identidad a nuestra ciudad.",
  },
  {
    image: Slide2,
    title: "Cultura y Turismo con Identidad",
    description:
      "Conoce los espacios culturales y turísticos que reflejan la tradición y el futuro de Tomé, con todos para todos.",
  },
  {
    image: Slide3,
    title: "Un Viaje por Nuestra Historia",
    description:
      "Cada rincón de Tomé guarda una historia: fábricas, iglesias y plazas que forman parte de nuestro patrimonio vivo.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-slide cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setImageLoaded(false);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setImageLoaded(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          aria-hidden={currentSlide !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Imagen de fondo */}
          <div
            className={`absolute inset-0 bg-cover bg-center ${
              imageLoaded ? "" : "bg-gray-300"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              onLoad={handleImageLoad}
              className="hidden"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          {/* Contenido del slide */}
          <div className="relative h-full flex items-center justify-center text-center text-white p-4 z-20">
            <div className="max-w-4xl animate-fadeIn">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{slide.description}</p>
              <Link to="/patrimonio/1">
                <Button className="bg-white text-[#2A624C] hover:bg-[#85BC03] hover:text-white z-30">
                  Explorar Patrimonios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors z-30"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors z-30"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default Hero;
