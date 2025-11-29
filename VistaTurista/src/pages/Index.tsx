import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import TestimonialsWithImages from "../components/TestimonialsWithImages";
import Footer from "../components/Footer";
import ImageCard from "@/components/ImageCard";

const Index = () => {
  const [patrimonios, setPatrimonios] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Municipalidad de Tomé – Turismo Institucional";

    const baseURL = import.meta.env.VITE_BASE_URL || "/api";
    fetch(`${baseURL}/patrimonios/public`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setPatrimonios(json.data);
        } else {
          setPatrimonios([]);
        }
      })
      .catch((err) => console.error("Error cargando patrimonios:", err));
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />
      <Hero />
      <Welcome />
      <TestimonialsWithImages />

      <section className="relative py-[120px] bg-white bg-cover bg-no-repeat bg-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2 mx-auto">
              <h3 className="font-AlbertSans font-semibold text-PrimaryColor-0 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-[#4a5c23] rounded-full"></span>
                Patrimonios
              </h3>
            </div>
            <h2 className="font-AlbertSans text-4xl md:text-4xl font-bold text-HeadingColor-0 mt-3">
              Explora los patrimonios de Tomé
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Conoce los lugares que forman parte de nuestra identidad cultural y turística.
            </p>
          </div>

          <ImageCard arr={patrimonios} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
