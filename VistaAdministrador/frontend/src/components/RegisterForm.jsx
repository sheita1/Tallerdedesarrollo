import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { registerUser } from "../services/auth.service"; // ajustá el path si es necesario
import "../styles/RegisterForm.css";


const userSchema = Yup.object().shape({
  nombreCompleto: Yup.string()
    .required("El nombre completo no puede estar vacío.")
    .min(15, "Debe tener como mínimo 15 caracteres.")
    .max(50, "Debe tener como máximo 50 caracteres.")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios."),

  email: Yup.string()
    .required("El correo no puede estar vacío.")
    .min(15, "Debe tener como mínimo 15 caracteres.")
    .max(35, "Debe tener como máximo 35 caracteres.")
    .email("Formato inválido.")
    .test("gmail-cl", "Debe terminar en @gmail.cl", (value) =>
      value?.endsWith("@gmail.cl")
    ),

  password: Yup.string()
    .required("La contraseña no puede estar vacía.")
    .min(8, "Debe tener como mínimo 8 caracteres.")
    .max(26, "Debe tener como máximo 26 caracteres.")
    .matches(/^[a-zA-Z0-9]+$/, "Solo letras y números."),

  rut: Yup.string()
    .required("El RUT no puede estar vacío.")
    .min(9, "Debe tener como mínimo 9 caracteres.")
    .max(12, "Debe tener como máximo 12 caracteres.")
    .matches(
      /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/,
      "Formato inválido. Ej: xx.xxx.xxx-x o xxxxxxxx-x"
    ),

  rol: Yup.string()
    .required("El rol es obligatorio.")
    .min(4, "Debe tener como mínimo 4 caracteres.")
    .max(15, "Debe tener como máximo 15 caracteres."),
});

export default function RegisterForm({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const onSubmit = async (formData) => {
    console.log("Formulario enviado:", formData);
    try {
      const response = await registerUser(formData);
      console.log("Respuesta del backend:", response);

      // ✅ Cierra el popup si el registro fue exitoso
      if (response?.status === 201 || response?.message?.includes("registrado")) {
        onClose?.(); // solo si se pasó como prop
      }
    } catch (error) {
      console.error("Error al registrar:", error.response?.data);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Nombre completo</label>
        <input type="text" {...register("nombreCompleto")} />
        {errors.nombreCompleto && <p className="error">{errors.nombreCompleto.message}</p>}
      </div>

      <div className="form-group">
        <label>RUT</label>
        <input type="text" {...register("rut")} />
        {errors.rut && <p className="error">{errors.rut.message}</p>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input type="password" {...register("password")} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div className="form-group">
        <label>Rol</label>
        <select {...register("rol")}>
          <option value="">Selecciona un rol</option>
          <option value="admin">Admin</option>
          <option value="vecino">Vecino</option>
        </select>
        {errors.rol && <p className="error">{errors.rol.message}</p>}
      </div>

      <button type="submit" disabled={Object.keys(errors).length > 0}>
        Registrar
      </button>
    </form>
  );
}
