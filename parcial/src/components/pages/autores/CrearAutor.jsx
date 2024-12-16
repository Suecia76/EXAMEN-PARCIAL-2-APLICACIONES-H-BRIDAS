import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import * as Yup from "yup";

const CrearAutor = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [libros, setLibros] = useState("");

  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") setNombre(value);
    if (name === "edad") setEdad(value);
    if (name === "libros") setLibros(value);
  };

  const validateForm = () => {
    const validationErrors = {};
    try {
      validationSchema.validateSync(
        { nombre, edad, libros },
        { abortEarly: false }
      );
    } catch (err) {
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("No se encontró un token. Inicia sesión.");
      }

      const datos = {
        nombre,
        edad,
        libros: libros.split(",").map((libro) => libro.trim()),
      };

      const response = await axios.post(
        "http://localhost:3000/autores",
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.data._id) {
        console.log("Autor creado con éxito:", response.data);
        navigate("/autores");
      } else {
        console.error("Error inesperado al crear autor:", response);
      }
    } catch (error) {
      console.error(
        "Error al crear autor:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-4 shadow p-3 rounded w-75 mx-auto crear"
    >
      <legend className="fw-bold">Crear Autor</legend>

      <div className="mb-3 w-75 mx-auto">
        <label htmlFor="nombre" className="fw-bold w-100 my-2">
          Nombre:
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          value={nombre}
          onChange={handleChange}
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
          value={edad}
          onChange={handleChange}
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
          value={libros}
          onChange={handleChange}
          placeholder="Ingrese los libros separados por comas"
        />
        {errors.libros && (
          <div className="invalid-feedback">{errors.libros}</div>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn botones" type="submit">
          Agregar Autor
        </button>
      </div>
    </form>
  );
};

export default CrearAutor;
