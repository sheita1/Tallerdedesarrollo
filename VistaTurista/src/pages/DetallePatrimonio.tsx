import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

// ✅ Registrar escaneo QR
const registrarEscaneo = async (patrimonioId) => {
  try {
    await fetch("http://localhost:3000/api/qr/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patrimonioId }),
    });
  } catch (error) {
    console.error("Error registrando escaneo QR:", error);
  }
};

// Componente de Rating
const Rating = ({ onRate }: { onRate: (value: number) => void }) => {
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

// Componente de Comentarios
const Comentarios = () => {
  const [comentarios, setComentarios] = useState<string[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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
  const [patrimonio, setPatrimonio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar patrimonio + registrar escaneo QR
  useEffect(() => {
    document.title = "Detalle de Patrimonio – TourCraft";

    // ✅ Registrar escaneo QR al entrar
    registrarEscaneo(id);

    fetch(`http://localhost:3000/api/patrimonios/detalle?id=${id}`)
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

  const handleRate = (value: number) => {
    console.log(`Patrimonio ${patrimonio.nombre} calificado con ${value} estrellas`);
    alert(`¡Gracias! Has calificado este patrimonio con ${value} estrellas.`);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />

      <main className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-4xl font-bold text-[#2A624C] mb-6">{patrimonio.nombre}</h1>

        {patrimonio.galeria && patrimonio.galeria.length > 0 && (
          <img
            src={`http://localhost:3000/${patrimonio.galeria[0]}`}
            alt={patrimonio.nombre}
            className="w-full max-h-[500px] object-cover rounded shadow-md mb-8"
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

        <h2 className="text-2xl font-semibold text-[#2A624C] mb-2">Califica este patrimonio</h2>
        <Rating onRate={handleRate} />

        <Comentarios />

        {patrimonio.galeria && patrimonio.galeria.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-[#2A624C] mb-4">Galería</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patrimonio.galeria.map((ruta: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:3000/${ruta}`}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-64 md:h-80 lg:h-96 object-contain rounded shadow-sm"
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
