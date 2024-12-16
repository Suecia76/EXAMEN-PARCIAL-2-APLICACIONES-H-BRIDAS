import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditarLibro = () => {
  const [libroEditando, setLibroEditando] = useState(null);
  const { id } = useParams();

  // Validación con Yup
  const validationSchema = Yup.object().shape({
    titulo: Yup.string()
      .required("El título es obligatorio")
      .min(3, "El título debe tener al menos 3 caracteres"),
    autor: Yup.string().required("El autor es obligatorio"),
    genero: Yup.string().required("El género es obligatorio"),
    synopsis: Yup.string()
      .required("La descripción es obligatoria")
      .min(10, "La descripción debe tener al menos 10 caracteres"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate(); // Inicializar useNavigate
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/libros/${id}`)
        .then((response) => {
          setLibroEditando(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener el libro:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (libroEditando) {
      Object.keys(libroEditando).forEach((key) =>
        setValue(key, libroEditando[key])
      );
    }
  }, [libroEditando, setValue]);

  const onSubmit = async (data) => {
    const token = Cookies.get("token") || null;

    try {
      await axios.put(
        `http://localhost:3000/libros/${libroEditando._id}`,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.log("Error al actualizar el libro:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-4 shadow p-3 rounded w-75 mx-auto crear"
    >
      <legend className="fw-bold">Editar libro</legend>
      <div className="mb-3 w-75 mx-auto">
        <label className="w-100 fw-bold">
          Nombre del libro:
          <input
            type="text"
            className="form-control"
            placeholder="Título del libro"
            {...register("titulo")}
          />
          <span className="text-danger">{errors.titulo?.message}</span>
        </label>
      </div>
      <div className="mb-3 w-75 mx-auto">
        <label className="w-100 fw-bold">
          Nombre del autor:
          <input
            type="text"
            className="form-control"
            placeholder="Autor del libro"
            {...register("autor")}
          />
          <span className="text-danger">{errors.autor?.message}</span>
        </label>
      </div>
      <div className="mb-3 w-75 mx-auto">
        <label className="w-100 fw-bold">
          Género/s del libro (separados por comas):
          <input
            type="text"
            className="form-control"
            placeholder="Género del libro"
            {...register("genero")}
          />
          <span className="text-danger">{errors.genero?.message}</span>
        </label>
      </div>
      <div className="mb-3 w-75 mx-auto">
        <label className="w-100 fw-bold">
          Descripción del libro:
          <textarea
            className="form-control"
            rows="3"
            placeholder="Descripción del libro"
            {...register("synopsis")}
          ></textarea>
          <span className="text-danger">{errors.synopsis?.message}</span>
        </label>
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn botones text-white" type="submit">
          Actualizar Libro
        </button>
      </div>
    </form>
  );
};

export default EditarLibro;
