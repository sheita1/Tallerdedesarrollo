import RegisterForm from './RegisterForm';
import '@styles/popup.css';

const PopupRegistrar = ({ isOpen, onClose, refreshUsers }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <RegisterForm onClose={onClose} refreshUsers={refreshUsers} />
      </div>
    </div>
  );
};

export default PopupRegistrar;
