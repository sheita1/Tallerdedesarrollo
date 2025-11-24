import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import MuniLogo from "../assets/images/muni1.webp";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2A624C]/90 text-white relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 h-64 w-64"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFFFFF"
            d="M39.9,-51.2C50.1,-39.4,56.2,-25.7,59.6,-10.9C63,3.9,63.7,19.8,57.1,31.5C50.5,43.2,36.5,50.7,21.7,56.6C6.9,62.5,-8.6,66.8,-23.3,63.6C-38,60.4,-51.8,49.8,-59.8,36C-67.8,22.2,-69.9,5.2,-66.1,-10.1C-62.3,-25.4,-52.6,-39,-40.2,-50.8C-27.8,-62.5,-13.9,-72.5,0.4,-73.1C14.8,-73.6,29.6,-64.9,39.9,-51.2Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute top-0 right-0 h-64 w-64"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFFFFF"
            d="M47.6,-57.3C57.9,-48.3,60.2,-29.8,62.1,-12.2C64,5.5,65.6,22.2,58.8,34.8C52,47.4,36.8,55.8,20.4,62.4C4.1,69,-13.4,73.8,-29,69.9C-44.5,66.1,-58.2,53.6,-65.3,38.4C-72.5,23.1,-73.2,5.1,-69.7,-11.3C-66.3,-27.8,-58.8,-42.6,-46.5,-51.4C-34.2,-60.2,-17.1,-62.9,0.6,-63.7C18.3,-64.4,36.7,-63.3,47.6,-57.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          {/* Logo & About */}
          <div>
            <img
              src={MuniLogo}
              alt="Logo Municipalidad de Tomé"
              className="p-1 rounded-lg mb-4 max-h-[80px] h-auto w-auto"
            />
            <p className="mb-4 text-gray-200">
              Municipalidad de Tomé — Con Todos Para Todos.  
              Promovemos el patrimonio, la cultura y el turismo local con identidad y compromiso.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                className="text-white hover:text-safari-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={30} />
              </a>
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                className="text-white hover:text-safari-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={30} />
              </a>
              <a
                href="https://www.twitter.com/"
                aria-label="Twitter"
                className="text-white hover:text-safari-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={30} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Patrimonios
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Cultura
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Turismo
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Patrimonios destacados */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Patrimonios Destacados</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-200 hover:text-white transition-colors">
                  Fábrica Textil Bellavista
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-200 hover:text-white transition-colors">
                  Iglesia de Tomé
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-200 hover:text-white transition-colors">
                  Caleta de pescadores
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-200 hover:text-white transition-colors">
                  Plaza de Armas
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contáctanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Municipalidad de Tomé, Región del Biobío, Chile
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0" />
                <a href="tel:+56412345678" className="hover:underline">
                  +56 41 234 5678
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
                <a href="mailto:contacto@munitome.cl" className="hover:underline">
                  contacto@munitome.cl
                </a>
              </li>
              <li className="text-white/90 flex mt-2 items-center">
                <FaWhatsapp className="w-7 h-7 text-white" />
                <a href="https://wa.me/+56912345678" className="ml-2 hover:underline">
                  +56 9 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 flex flex-wrap justify-between items-center text-sm text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Municipalidad de Tomé. Todos los derechos reservados.
          </p>
          <Link
            to="#"
            className="hover:text-white transition-colors"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
