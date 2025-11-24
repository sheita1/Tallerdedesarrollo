import RegisterPatrimonioForm from './RegisterPatrimonioForm';
import '@styles/popup.css';

const PopupRegistrarPatrimonio = ({ isOpen, onClose, refreshPatrimonios }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <RegisterPatrimonioForm
          onClose={onClose}
          refreshPatrimonios={refreshPatrimonios}
        />
      </div>
    </div>
  );
};

export default PopupRegistrarPatrimonio;
