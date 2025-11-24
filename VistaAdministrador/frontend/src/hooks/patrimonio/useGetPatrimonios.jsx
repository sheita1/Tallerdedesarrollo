import { useState, useEffect } from 'react';
import { getPatrimonios } from '@services/patrimonio.service.js';

const usePatrimonios = () => {
  const [patrimonios, setPatrimonios] = useState([]);

  const fetchPatrimonios = async () => {
    try {
      const response = await getPatrimonios();
      setPatrimonios(response);
    } catch (error) {
      console.error("Error al obtener patrimonios:", error);
    }
  };

  useEffect(() => {
    fetchPatrimonios();
  }, []);

  return { patrimonios, fetchPatrimonios, setPatrimonios };
};

export default usePatrimonios;
