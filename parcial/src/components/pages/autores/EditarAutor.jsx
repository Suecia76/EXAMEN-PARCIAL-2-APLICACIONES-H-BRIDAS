import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const EditarAutor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formulario, setFormulario] = useState({
    nombre: "",
    edad: "",
    libros: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/autores/${id}`)
        .then((response) => {
          const autor = response.data;
          setFormulario({
            nombre: autor.nombre,
            edad: autor.edad.toString(),
            libros: autor.libros.join(", "),
          });
        })
        .catch((error) => {
          console.error("Error al obtener el autor:", error);
        });
    }
  }, [id]);

  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    edad: Yup.number()
      .required("La edad es obligatoria")
      .positive("La edad debe ser un número positivo")
      .integer("La edad debe ser un número entero"),
    libros: Yup.string()
      .required("Los libros son obligatorios")
      .test(
        "libros-validos",
        "Debes ingresar al menos un libro separado por comas",
        (value) =>
          value && value.split(",").every((libro) => libro.trim() !== "")
      ),
  });

  const validateForm = () => {
    const validationErrors = {};
    try {
      validationSchema.validateSync(formulario, { abortEarly: false });
    } catch (err) {
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No se encontró un token. Por favor, inicia sesión.");
      }

      const datos = {
        ...formulario,
        libros: formulario.libros.split(",").map((libro) => libro.trim()),
      };

      const response = await axios.put(
        `http://localhost:3000/autores/${id}`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Autor actualizado con éxito:", response.data);
        navigate("/autores");
      } else {
        console.error("Error inesperado al actualizar autor:", response);
      }
    } catch (error) {
      console.error(
        "Error al actualizar autor:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-4 shadow p-3 rounded w-75 mx-auto crear"
    >
      <legend className="fw-bold">Editar Autor</legend>

      <div className="mb-3 w-75 mx-auto">
        <label htmlFor="nombre" className="fw-bold w-100 my-2">
          Nombre:
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          value={formulario.nombre}
          onChange={handleInputChange}
          placeholder="Ingrese el nombre"
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre}</div>
        )}
      </div>

      <div className="mb-3 w-75 mx-auto">
        <label htmlFor="edad" className="fw-bold w-100 my-2">
          Edad:
        </label>
        <input
          id="edad"
          name="edad"
          type="number"
          className={`form-control ${errors.edad ? "is-invalid" : ""}`}
          value={formulario.edad}
          onChange={handleInputChange}
          placeholder="Ingrese la edad"
        />
        {errors.edad && <div className="invalid-feedback">{errors.edad}</div>}
      </div>

      <div className="mb-3 w-75 mx-auto">
        <label htmlFor="libros" className="fw-bold w-100 my-2">
          Libros:
        </label>
        <input
          id="libros"
          name="libros"
          type="text"
          className={`form-control ${errors.libros ? "is-invalid" : ""}`}
          value={formulario.libros}
          onChange={handleInputChange}
          placeholder="Ingrese los libros separados por comas"
        />
        {errors.libros && (
          <div className="invalid-feedback">{errors.libros}</div>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary me-2" type="submit">
          Actualizar Autor
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => navigate("/autores")}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarAutor;
