import React, { useEffect, useState } from "react";
//import HeroSection from "../components/HeroSection";
//import PatrimonioCard from "../components/PatrimonioCard";
//import Footer from "../components/Footer";
//import "../styles/template.css";
;

export default function TurismoOnePage() {
  const [patrimonios, setPatrimonios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/patrimonios/public")
      .then((res) => res.json())
      .then((data) => setPatrimonios(data.data || []))
      .catch((err) => console.error("Error al cargar patrimonios públicos", err));
  }, []);

  return (
    <div className="content-wrapper">
      {/* Hero institucional */}
      <HeroSection />

      {/* Línea decorativa central */}
      <section className="content-lines-wrapper">
        <div className="content-lines-inner">
          <div className="content-lines"></div>
        </div>
      </section>

      {/* Sección de Patrimonios */}
      <section id="projects" className="projects section-padding" data-scroll-index="2">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="section-title">Nuestros <span>Patrimonios</span></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 owl-carousel owl-theme">
              {patrimonios.map((p) => (
                <PatrimonioCard key={p.id} patrimonio={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer institucional */}
      <Footer />
    </div>
  );
}
