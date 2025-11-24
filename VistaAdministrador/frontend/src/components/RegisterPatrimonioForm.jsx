import Form from './Form';
import { registerPatrimonio } from '@services/patrimonio.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';

const RegisterPatrimonioForm = ({ onClose, refreshPatrimonios }) => {
  const fields = [
    {
      name: 'nombre',
      label: 'Nombre del patrimonio',
      placeholder: 'Ej. Fuerte Niebla',
      type: 'text',
      fieldType: 'input',
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    {
      name: 'ubicacion',
      label: 'Ubicación',
      placeholder: 'Ej. Valdivia, Región de Los Ríos',
      type: 'text',
      fieldType: 'input',
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      placeholder: 'Breve reseña histórica o cultural',
      fieldType: 'textarea',
      required: false,
      maxLength: 1000,
    },
    {
      name: 'tipo',
      label: 'Tipo de patrimonio',
      fieldType: 'select',
      required: true,
      defaultValue: '',
      options: [
        { label: 'Histórico', value: 'histórico' },
        { label: 'Natural', value: 'natural' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Mixto', value: 'mixto' },
      ],
    },
    {
      name: 'estado',
      label: 'Estado',
      fieldType: 'select',
      required: true,
      defaultValue: 'activo',
      options: [
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'inactivo' },
      ],
    },
  ];

  const handleSubmit = async (data) => {
    try {
      const response = await registerPatrimonio(data);
      showSuccessAlert('Registro exitoso', 'Patrimonio creado correctamente');
      refreshPatrimonios?.();
      onClose?.();
    } catch (error) {
      showErrorAlert('Error', error.response?.data?.message || 'No se pudo registrar el patrimonio');
    }
  };

  return (
    <Form
      title="Registrar nuevo patrimonio"
      fields={fields}
      buttonText="Registrar"
      onSubmit={handleSubmit}
      backgroundColor="#f5f5f5"
    />
  );
};

export default RegisterPatrimonioForm;
