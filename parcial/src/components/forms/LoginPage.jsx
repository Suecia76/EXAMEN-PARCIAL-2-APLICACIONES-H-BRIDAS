import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// Esquema de validación con Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("Formato de email no válido"),
  contraseña: yup.string().required("La contraseña es obligatoria"),
});

const LoginUsuario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    try {
      // Petición al backend
      const response = await axios.post(
        "http://localhost:3000/usuarios/login",
        data
      );

      alert("Inicio de sesión exitoso");

      // Almacenar el token en cookies
      const { jwToken, usuario } = response.data;
      Cookies.set("token", jwToken, { expires: 3 });

      // Establecer el usuario en el contexto
      setUser({
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      });

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.mensaje ||
          "Error al iniciar sesión, intente de nuevo"
      );
      console.error("Error de inicio de sesión:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 ">
          <div className="card shadow">
            <div className="card-header text-center botones">
              <h2>Inicio de Sesión</h2>
            </div>
            <div className="card-body color-fondo">
              <form onSubmit={handleSubmit(onSubmit)}>
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

                <div className="mb-3">
                  <p>
                    ¿Todavía no tienes una cuenta?{" "}
                    <Link to={"/registro"}>Regístrate aquí</Link>
                  </p>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary botones border"
                  >
                    Iniciar Sesión
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

export default LoginUsuario;
