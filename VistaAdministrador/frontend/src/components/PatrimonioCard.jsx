// src/components/PatrimonioCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PatrimonioCard({ patrimonio }) {
  return (
    <div className="item">
      <div className="position-re o-hidden">
        <img src={`http://localhost:3000/patrimonios/${patrimonio.imagenDestacada}`} alt={patrimonio.nombre} />
      </div>
      <div className="con">
        <h6>{patrimonio.tipo}</h6>
        <h5>{patrimonio.nombre}</h5>
        <p>{patrimonio.descripcion.slice(0, 100)}...</p>
        <div className="line"></div>
        <Link to={`/patrimonio/${patrimonio.id}`}>
          <i className="ti-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
