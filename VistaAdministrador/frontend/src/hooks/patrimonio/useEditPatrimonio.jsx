import { useState } from 'react';
import { updatePatrimonio } from '@services/patrimonio.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPostUpdatePatrimonio } from '@helpers/formatData.js';

const useEditPatrimonio = (setPatrimonios) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataPatrimonio, setDataPatrimonio] = useState([]);

  const handleClickUpdate = () => {
    if (dataPatrimonio.length > 0) {
      setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (updatedData) => {
    if (updatedData) {
      try {
        const updated = await updatePatrimonio(updatedData, dataPatrimonio[0].id);
        showSuccessAlert('¡Actualizado!', 'El patrimonio ha sido actualizado correctamente.');
        setIsPopupOpen(false);

        const formatted = formatPostUpdatePatrimonio(updated);

        setPatrimonios(prev => prev.map(p => p.id === formatted.id ? formatted : p));
        setDataPatrimonio([]);
      } catch (error) {
        console.error('Error al actualizar el patrimonio:', error);
        showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el patrimonio.');
      }
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataPatrimonio,
    setDataPatrimonio
  };
};

export default useEditPatrimonio;
