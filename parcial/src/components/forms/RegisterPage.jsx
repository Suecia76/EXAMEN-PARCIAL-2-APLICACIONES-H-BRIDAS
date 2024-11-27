import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";

// Esquema de validación con Yup
const schema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("Formato de email no válido"),
  contraseña: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres"),
});

const RegistroUsuario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      email: "",
      contraseña: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema), // Conecta Yup con React Hook Form
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const datosConRol = { ...data, rol: "usuario comun" };
      console.log("Datos enviados:", datosConRol);
      const response = await axios.post(
        "http://localhost:3000/usuarios/registrar",
        datosConRol
      );

      alert("Usuario registrado exitosamente");
      console.log(response.data);
      navigate("/iniciar_sesion");
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar el usuario");
      console.error("Error al registrar el usuario:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center botones">
              <h2>Registro de Usuario</h2>
            </div>
            <div className="card-body color-fondo">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label fw-bold">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className={`form-control ${
                      errors.nombre ? "is-invalid" : ""
                    }`}
                    {...register("nombre")}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback">
                      {errors.nombre.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="contraseña" className="form-label fw-bold">
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    id="contraseña"
                    className={`form-control ${
                      errors.contraseña ? "is-invalid" : ""
                    }`}
                    {...register("contraseña")}
                  />
                  {errors.contraseña && (
                    <div className="invalid-feedback">
                      {errors.contraseña.message}
                    </div>
                  )}
                </div>

                <div className="mb-3 text-center">
                  <p className="text-start">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/iniciar_sesion">Inicia sesión aquí</Link>
                  </p>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-success botones border"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;
