import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MuniLogo from "../assets/images/muni1.webp";

const Welcome = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Texto a la izquierda */}
        <div className="space-y-6">
          {/* Etiqueta destacada */}
          <h3 className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#4a5c23] rounded-full"></span>
            <span className="text-sm font-medium">
              Bienvenido a la Municipalidad de Tomé
            </span>
          </h3>

          {/* Título principal */}
          <h2 className="text-4xl md:text-4xl font-bold text-[#2A624C]">
            Patrimonio, Cultura y Turismo con Identidad
          </h2>

          {/* Párrafos */}
          <p className="text-gray-600 leading-relaxed">
            Descubre la riqueza patrimonial y cultural de Tomé. Nuestra ciudad
            se caracteriza por su historia textil, sus caletas de pescadores y
            sus paisajes costeros únicos. Este proyecto busca acercar a
            ciudadanos y turistas a los principales patrimonios locales,
            fomentando la identidad y el turismo sostenible.
          </p>
          <p className="text-gray-700 font-semibold">
            Con todos para todos: Tomé, una ciudad que preserva su historia y
            proyecta su futuro.
          </p>

          {/* Botón de acción */}
          <Link to="/patrimonio/1" aria-label="Explora los patrimonios de Tomé">
            <Button className="bg-[#2A624C] hover:bg-[#24523f] text-white mt-4">
              Explorar Patrimonios
            </Button>
          </Link>
        </div>

        {/* Imagen a la derecha */}
        <div className="relative">
          <img
            src={MuniLogo}
            alt="Logo Municipalidad de Tomé"
            className="w-full h-auto rounded-lg relative z-10 object-contain max-h-[300px] mx-auto"
          />
          {/* Círculo decorativo */}
          <div className="bg-[#95D103]/10 absolute -bottom-4 -right-4 w-32 h-32 rounded-full z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
