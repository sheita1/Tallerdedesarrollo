import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@components/Table';
import Search from '@components/Search';
import PopupPatrimonio from '@components/PopupPatrimonio';
import PopupRegistrarPatrimonio from '@components/PopupRegistrarPatrimonio';
import usePatrimonios from '@hooks/patrimonio/useGetPatrimonios.jsx';
import useEditPatrimonio from '@hooks/patrimonio/useEditPatrimonio';
import useDeletePatrimonio from '@hooks/patrimonio/useDeletePatrimonio';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import '@styles/patrimonios.css';

const Patrimonios = () => {
  const { patrimonios, fetchPatrimonios, setPatrimonios } = usePatrimonios();
  const [filterNombre, setFilterNombre] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataPatrimonio,
    setDataPatrimonio
  } = useEditPatrimonio(setPatrimonios);

  const { handleDelete } = useDeletePatrimonio(fetchPatrimonios, setDataPatrimonio);

  const handleNombreFilterChange = (e) => {
    setFilterNombre(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedItems) => {
    setDataPatrimonio(selectedItems);
  }, [setDataPatrimonio]);

  const columns = [
    { title: "Nombre", field: "nombre", width: 300, responsive: 0 },
    { title: "Ubicación", field: "ubicacion", width: 300, responsive: 2 },
    { title: "Tipo", field: "tipo", width: 150, responsive: 2 },
    { title: "Estado", field: "estado", width: 150, responsive: 2 },
    { title: "Registrado", field: "fechaRegistro", width: 200, responsive: 2 },
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Patrimonios</h1>
          <div className='filter-actions'>
            <Search value={filterNombre} onChange={handleNombreFilterChange} placeholder={'Filtrar por nombre'} />

            <button className='add-button' onClick={() => setShowRegisterModal(true)}>
              Registrar Patrimonio
            </button>

            <button onClick={handleClickUpdate} disabled={dataPatrimonio.length === 0}>
              {dataPatrimonio.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>

            <button className='delete-user-button' disabled={dataPatrimonio.length === 0} onClick={() => handleDelete(dataPatrimonio)}>
              {dataPatrimonio.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>

        <Table
          data={patrimonios}
          columns={columns}
          filter={filterNombre}
          dataToFilter={'nombre'}
          initialSortName={'nombre'}
          onSelectionChange={handleSelectionChange}
        />

        {dataPatrimonio.length === 1 && (
  <div className="galeria-button-container">
    <button
      className="gallery-button"
      onClick={() => navigate(`/galeria/${dataPatrimonio[0].id}`)}
    >
      📷 Ver galería del patrimonio #{dataPatrimonio[0].id}
    </button>
  </div>
)}

      </div>

      <PopupPatrimonio show={isPopupOpen} setShow={setIsPopupOpen} data={dataPatrimonio} action={handleUpdate} />

      <PopupRegistrarPatrimonio
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        refreshPatrimonios={fetchPatrimonios}
      />
    </div>
  );
};

export default Patrimonios;
