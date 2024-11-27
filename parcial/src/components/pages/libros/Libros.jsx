import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import useDebounce from "../../hooks/useDebounce";
import { UserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [editando, setEditando] = useState(null); // Estado para manejar la edición
  const [page, setPage] = useState(1); // Página actual
  const [limit, setLimit] = useState(10); // Límite de libros por página
  const [totalPaginas, setTotalPaginas] = useState(0); // Total de páginas disponibles
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearch = useDebounce(search, 1000);

  const { user } = useContext(UserContext);

  // Yup schema de validación
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
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  // Obtener los libros con paginado
  const ver_libros = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/libros/paginado?pagina=${page}&limite=${limit}`
      );
      setLibros(Array.isArray(res.data.libros) ? res.data.libros : []); // Asegura que sea un array
      setTotalPaginas(res.data.numero_paginas); // Total de páginas
    } catch (error) {
      console.log("Error al obtener los libros:", error);
      setLibros([]); // En caso de error, vaciar la lista
    }
  };

  const handleAddBook = async (data) => {
    const token = Cookies.get("token") || null;

    try {
      if (editando) {
        // Lógica para editar un libro
        await axios.put(`http://localhost:3000/libros/${editando}`, data, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        setEditando(null); // Salir del modo edición
      } else {
        // Lógica para agregar un nuevo libro
        await axios.post("http://localhost:3000/libros", data, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
      }
      ver_libros();
      reset(); // Limpiar el formulario después de enviar
    } catch (error) {
      console.log("Error al agregar/editar el libro:", error);
    }
  };

  const handleEdit = (libro) => {
    // Rellenar los campos con los datos del libro seleccionado
    setValue("titulo", libro.titulo);
    setValue("autor", libro.autor);
    setValue("genero", libro.genero);
    setValue("synopsis", libro.synopsis);
    setEditando(libro._id); // Establecer el ID del libro en edición
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("token") || null;

    try {
      await axios.delete(`http://localhost:3000/libros/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      ver_libros(); // Actualizar la lista de libros
    } catch (error) {
      console.log("Error al eliminar el libro:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPaginas) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    ver_libros();
  }, [search, page, limit]); // Ejecutar cuando cambie la página o el límite

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (searchTerm) => {
    console.log(searchTerm);
    try {
      const res = await axios.get(
        "http://localhost:3000/libros/buscar/nombre",
        {
          params: {
            titulo: searchTerm,
          },
        }
      );
      setLibros(res.data.libros || []);
      setSuggestions([]); // Limpiar las sugerencias
    } catch (error) {
      console.log("Error al buscar un libro:", error);
      setLibros([]);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Gestión de Libros</h1>
      {Cookies.get("token") && (
        <form
          onSubmit={handleSubmit(handleAddBook)}
          className="mb-4 shadow p-3 rounded w-75 mx-auto crear"
        >
          <legend className="fw-bold">Crea un libro</legend>
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
              Género del libro:
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
              {editando ? "Actualizar Libro" : "Agregar Libro"}
            </button>
          </div>
        </form>
      )}

      <form className="my-5 w-75 mx-auto">
        <legend>Busca un libro</legend>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={search}
            placeholder="Buscar por título"
            onChange={handleSearchChange}
          />
          <button className="btn btn-secondary" type="button">
            Buscar
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group mt-2">
            {suggestions.map((suggestion) => (
              <li
                className="list-group-item"
                onClick={() => handleSuggestionClick(suggestion.titulo)}
                key={suggestion._id}
              >
                {suggestion.titulo}
              </li>
            ))}
          </ul>
        )}
      </form>
      <section className="section p-3 rounded ">
        <h2>Lista de libros</h2>
        <ul className="list-group mb-4">
          {Array.isArray(libros) &&
            libros.map((libro) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={libro._id}
              >
                <Link
                  className="link-offset-2 link-underline link-underline-opacity-0 text-black fw-bold"
                  to={`/libros/${libro._id}`}
                >
                  {libro.titulo}
                </Link>

                {user && user.rol === "admin" && (
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(libro)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(libro._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
                {user && user.rol === "editor" && (
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(libro)}
                    >
                      Editar
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>

        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn border border-warning fw-bold botones "
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPaginas}
          </span>
          <button
            className="btn border border-warning fw-bold botones "
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </section>
    </div>
  );
};

export default Libros;
