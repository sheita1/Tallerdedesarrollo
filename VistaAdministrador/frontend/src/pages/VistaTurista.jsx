// src/pages/VistaTurista.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VistaTurista() {
  const { id } = useParams();
  const [patrimonio, setPatrimonio] = useState(null);

  useEffect(() => {
    const baseURL = import.meta.env.VITE_BASE_URL || "/api";
    fetch(`${baseURL}/patrimonios/detalle?id=${id}`)
      .then((res) => res.json())
      .then((data) => setPatrimonio(data.data))
      .catch((err) => console.error("❌ Error al cargar detalle", err));
  }, [id]);

  if (!patrimonio) return <p className="section-padding">Cargando patrimonio...</p>;

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-30">
            <h2 className="section-title">{patrimonio.nombre}</h2>
            <p>{patrimonio.descripcion}</p>
            <p><b>Ubicación:</b> {patrimonio.ubicacion}</p>
            <p><b>Tipo:</b> {patrimonio.tipo}</p>
          </div>
          <div className="col-md-6">
            <img
              src={`/uploads/${patrimonio.imagenDestacada}`}
              alt={patrimonio.nombre}
              className="img-fluid"
            />
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="section-title">Galería</h2>
          </div>
          {patrimonio.galeria.map((ruta, i) => (
            <div key={i} className="col-md-4 mb-30">
              <div className="projects item">
                <div className="position-re o-hidden">
                  <img
                    src={`/uploads/${ruta}`}
                    alt={`Imagen ${i + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
