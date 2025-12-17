import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
// import { getApiBaseUrl } from "../utils/apiBase"; // Lo comentamos para forzar la IP correcta aquí mismo

// ✅ CONFIGURACIÓN IP SERVIDOR (Backend Puerto 1556)
const URL_BACKEND = "http://146.83.194.168:1556";
const api = `${URL_BACKEND}/api`;
const SERVER_URL = URL_BACKEND;

// Función auxiliar para armar la URL de la imagen
const getImageUrl = (ruta) => {
  if (!ruta) return "/placeholder.png";
  if (ruta.startsWith("http")) return ruta;
  // Si la ruta viene del backend, le pegamos el dominio del servidor
  return `${SERVER_URL}${ruta}`;
};

// ✅ Registrar escaneo QR
const registrarEscaneo = async (patrimonioId) => {
  try {
    await fetch(`${api}/qr/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patrimonioId }),
    });
  } catch (error) {
    console.error("Error registrando escaneo QR:", error);
  }
};

const Rating = ({ onRate }) => {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);

  return (
    <div className="flex items-center space-x-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={(hover || rating) >= star ? "#facc15" : "none"}
          stroke="#facc15"
          strokeWidth={2}
          className="w-8 h-8 cursor-pointer transition-colors"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => {
            setRating(star);
            onRate(star);
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.11a.563.563 0 00.475.345l5.518.401c.48.035.675.64.292.96l-4.207 3.602a.563.563 0 00-.182.557l1.25 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.25-5.385a.563.563 0 00-.182-.557l-4.207-3.602a.563.563 0 01.292-.96l5.518-.401a.563.563 0 00.475-.345l2.125-5.11z"
          />
        </svg>
      ))}
    </div>
  );
};

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoComentario.trim() === "") return;
    setComentarios([...comentarios, nuevoComentario]);
    setNuevoComentario("");
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-[#2A624C] mb-4">Comentarios</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-6">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Escribe tu opinión sobre este patrimonio..."
          className="w-full border rounded px-3 py-2 h-24 resize-none"
        />
        <button
          type="submit"
          className="bg-[#2A624C] text-white px-6 py-2 rounded hover:bg-[#24523f] self-end"
        >
          Publicar
        </button>
      </form>

      <div className="space-y-4">
        {comentarios.length === 0 ? (
          <p className="text-gray-500">Aún no hay comentarios. Sé el primero en opinar.</p>
        ) : (
          comentarios.map((c, i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded shadow-sm border border-gray-200"
            >
              <p className="text-gray-700">{c}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DetallePatrimonio = () => {
  const { id } = useParams();
  const [patrimonio, setPatrimonio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Detalle de Patrimonio – TourCraft";

    registrarEscaneo(id);

    // ⚠️ CAMBIO IMPORTANTE: En el backend configuramos "/detail", no "/detalle"
    // Ajusté esto para que coincida con lo que subimos al servidor.
    fetch(`${api}/patrimonios/detail?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setPatrimonio(json.data);
        } else {
          setPatrimonio(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando patrimonio:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-20">Cargando patrimonio...</p>;
  if (!patrimonio) return <p className="text-center mt-20">Patrimonio no encontrado.</p>;

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />

      <main className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-4xl font-bold text-[#2A624C] mb-6">{patrimonio.nombre}</h1>

        {/* ✅ Imagen principal */}
        {patrimonio.imagen && (
          <img
            src={getImageUrl(patrimonio.imagen)}
            alt={patrimonio.nombre}
            className="w-full max-h-[500px] object-cover rounded shadow-md mb-8"
            onError={(e) => { e.target.src = "/placeholder.png" }}
          />
        )}

        <p className="text-lg text-gray-700 mb-4">
          <strong>Ubicación:</strong> {patrimonio.ubicacion}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Tipo:</strong> {patrimonio.tipo}
        </p>
        <p className="text-lg text-gray-700 mb-8">
          <strong>Descripción:</strong> {patrimonio.descripcion}
        </p>

        <Comentarios />

        {/* ✅ Galería integrada (COMO EN TU ORIGINAL) */}
        {patrimonio.galeria && patrimonio.galeria.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-[#2A624C] mb-4">Galería</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patrimonio.galeria.map((ruta, index) => (
                <img
                  key={index}
                  src={getImageUrl(ruta)}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-64 md:h-80 lg:h-96 object-contain rounded shadow-sm"
                  onError={(e) => { e.target.src = "/placeholder.png" }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DetallePatrimonio;