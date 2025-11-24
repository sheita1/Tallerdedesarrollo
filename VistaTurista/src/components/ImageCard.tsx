import { Link } from "react-router-dom";

interface Item {
  id: number | string;
  imagenDestacada: string;
  nombre: string;
  descripcion?: string;
}

interface ImageCardProps {
  arr: Item[];
}

const ImageCard: React.FC<ImageCardProps> = ({ arr }) => {
  if (!Array.isArray(arr)) return null; // 👈 seguridad extra

  return (
    <div className="flex justify-center flex-wrap">
      {arr.map((item) => (
        <div
          key={item.id}
          className="w-full md:w-2/4 lg:w-1/4 pb-5 px-2 md:px-5"
        >
          <div className="bg-white shadow-md rounded hover:shadow-lg transition-shadow duration-300">
            {/* Imagen */}
            <Link to={`/patrimonio/${item.id}`}>
              <img
                src={`http://localhost:3000/${item.imagenDestacada}`} // 👈 usa imagenDestacada
                alt={`${item.nombre} | TourCraft`} // 👈 usa nombre
                className="w-full h-64 object-cover rounded-t relative z-10 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </Link>

            {/* Título con link */}
            <div className="flex flex-col items-center px-5 pt-2 pb-2 text-center">
              <Link
                to={`/patrimonio/${item.id}`}
                className="flex items-center text-[#2A624C] font-medium hover:text-safari-brown transition-colors duration-200 cursor-pointer"
              >
                <h3 className="text-[18px] font-semibold">{item.nombre}</h3>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCard;
