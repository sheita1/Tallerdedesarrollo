import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/muni1.webp";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [patrimonios, setPatrimonios] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/patrimonios/public")
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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[80px]">
          <Link to="/" className="text-2xl font-bold text-[#2A624C]">
            <img
              src={Logo}
              alt="Logo Municipalidad de Tomé"
              className="max-h-[64px] h-auto w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/">Inicio</NavLink>
            {patrimonios.map((p) => (
              <NavLink key={p.id} to={`/patrimonio/${p.id}`}>
                {p.nombre}
              </NavLink>
            ))}
            {/* ✅ Ahora Contacto apunta a la nueva página */}
            <NavLink to="/contacto">Contacto</NavLink>
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#2A624C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Fondo oscuro al abrir menú móvil */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar móvil */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-md transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div className="flex flex-col space-y-4 p-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          {patrimonios.map((p) => (
            <NavLink
              key={p.id}
              to={`/patrimonio/${p.id}`}
              onClick={() => setMenuOpen(false)}
            >
              {p.nombre}
            </NavLink>
          ))}
          {/* ✅ Contacto también en menú móvil */}
          <NavLink to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-[#2A624C] font-medium hover:text-safari-brown transition-colors duration-200"
  >
    {children}
  </Link>
);

export default Navigation;
