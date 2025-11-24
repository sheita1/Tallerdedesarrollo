import { deletePatrimonio } from '@services/patrimonio.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeletePatrimonio = (fetchPatrimonios, setDataPatrimonio) => {
  const handleDelete = async (dataPatrimonio) => {
    if (dataPatrimonio.length > 0) {
      try {
        const result = await deleteDataAlert();
        if (result.isConfirmed) {
          const response = await deletePatrimonio(dataPatrimonio[0].id);
          if (response.status === 'Client error') {
            return showErrorAlert('Error', response.details);
          }
          showSuccessAlert('¡Eliminado!', 'El patrimonio ha sido eliminado correctamente.');
          await fetchPatrimonios();
          setDataPatrimonio([]);
        } else {
          showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
        }
      } catch (error) {
        console.error('Error al eliminar el patrimonio:', error);
        showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el patrimonio.');
      }
    }
  };

  return {
    handleDelete
  };
};

export default useDeletePatrimonio;
