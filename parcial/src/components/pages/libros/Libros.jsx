import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import useDebounce from "../../hooks/useDebounce";
import { UserContext } from "../../context/UserContext";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [page, setPage] = useState(1); // Página actual
  const [limit, setLimit] = useState(10); // Límite de libros por página
  const [totalPaginas, setTotalPaginas] = useState(0); // Total de páginas disponibles
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearch = useDebounce(search, 1000);
  const [showModal, setShowModal] = useState(false);
  const [libroIdToDelete, setLibroIdToDelete] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Obtener los libros con paginado
  const ver_libros = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/libros/paginado?pagina=${page}&limite=${limit}`
      );
      setLibros(Array.isArray(res.data.libros) ? res.data.libros : []);
      setTotalPaginas(res.data.numero_paginas); // Total de páginas
    } catch (error) {
      console.log("Error al obtener los libros:", error);
      setLibros([]); // En caso de error, vaciar la lista
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPaginas) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    ver_libros();
  }, [debouncedSearch, page, limit]); // Ejecutar cuando cambie la búsqueda, la página o el límite

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (searchTerm) => {
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

  // Handle eliminar
  const handleDelete = async () => {
    const token = Cookies.get("token") || null;

    try {
      await axios.delete(`http://localhost:3000/libros/${libroIdToDelete}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      ver_libros(); // Actualizar la lista de libros
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.log("Error al eliminar el libro:", error);
    }
  };

  const handleOpenModal = (id) => {
    setLibroIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLibroIdToDelete(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Gestión de Libros</h1>
      {Cookies.get("token") && (
        <div className="text-center mb-4">
          <button
            className="btn botones"
            onClick={() => navigate("/libros/crear")}
          >
            Crear Libros
          </button>
        </div>
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
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => handleSearch(search)}
          >
            Buscar
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group mt-2">
            {suggestions.map((suggestion) => (
              <li
                className="list-group-item"
                onClick={() => handleSearch(suggestion.titulo)}
                key={suggestion._id}
              >
                {suggestion.titulo}
              </li>
            ))}
          </ul>
        )}
      </form>
      <section className="section p-3 rounded">
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
                      onClick={() => navigate(`/libros/editar/${libro._id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleOpenModal(libro._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
                {user && user.rol === "editor" && (
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/libros/editar/${libro._id}`)}
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
            className="btn border border-warning fw-bold botones"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPaginas}
          </span>
          <button
            className="btn border border-warning fw-bold botones"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </section>

      {/* Modal de confirmación de eliminación */}
      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmación de Eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este libro?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Libros;
