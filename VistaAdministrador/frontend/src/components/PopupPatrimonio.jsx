import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupPatrimonio({ show, setShow, data, action }) {
  const patrimonioData = data && data.length > 0 ? data[0] : {};

  const handleSubmit = (formData) => {
    action(formData);
  };

  return (
    <div>
      {show && (
        <div className="bg">
          <div className="popup">
            <button className="close" onClick={() => setShow(false)}>
              <img src={CloseIcon} />
            </button>
            <Form
              title="Editar patrimonio"
              fields={[
                {
                  label: "Nombre",
                  name: "nombre",
                  defaultValue: patrimonioData.nombre || "",
                  placeholder: "Ej. Fuerte Niebla",
                  fieldType: "input",
                  type: "text",
                  required: true,
                  minLength: 3,
                  maxLength: 255,
                },
                {
                  label: "Ubicación",
                  name: "ubicacion",
                  defaultValue: patrimonioData.ubicacion || "",
                  placeholder: "Ej. Valdivia, Región de Los Ríos",
                  fieldType: "input",
                  type: "text",
                  required: true,
                  minLength: 3,
                  maxLength: 255,
                },
                {
                  label: "Descripción",
                  name: "descripcion",
                  defaultValue: patrimonioData.descripcion || "",
                  placeholder: "Breve reseña histórica o cultural",
                  fieldType: "textarea",
                  required: false,
                  maxLength: 1000,
                },
                {
                  label: "Tipo",
                  name: "tipo",
                  fieldType: "select",
                  defaultValue: patrimonioData.tipo || "",
                  required: true,
                  options: [
                    { label: "Histórico", value: "histórico" },
                    { label: "Natural", value: "natural" },
                    { label: "Cultural", value: "cultural" },
                    { label: "Mixto", value: "mixto" },
                  ],
                },
                {
                  label: (
                    <span>
                      Estado
                      <span className="tooltip-icon">
                        <img src={QuestionIcon} />
                        <span className="tooltip-text">Activo o inactivo</span>
                      </span>
                    </span>
                  ),
                  name: "estado",
                  fieldType: "select",
                  defaultValue: patrimonioData.estado || "activo",
                  required: true,
                  options: [
                    { label: "Activo", value: "activo" },
                    { label: "Inactivo", value: "inactivo" },
                  ],
                },
              ]}
              onSubmit={handleSubmit}
              buttonText="Editar patrimonio"
              backgroundColor="#fff"
            />
          </div>
        </div>
      )}
    </div>
  );
}
