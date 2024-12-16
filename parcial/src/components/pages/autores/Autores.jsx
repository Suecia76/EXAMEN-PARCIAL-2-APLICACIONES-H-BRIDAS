import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { UserContext } from "../../context/UserContext";

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [search, setSearch] = useState("");
  const [autorEliminando, setAutorEliminando] = useState(null);
  const debouncedSearch = useDebounce(search, 1000);
  const { user } = useContext(UserContext);

  const getAuthHeaders = () => {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Obtener todos los autores
  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const response = await axios.get("http://localhost:3000/autores", {
          headers: getAuthHeaders(),
        });
        setAutores(response.data);
      } catch (error) {
        console.error("Error al obtener autores:", error);
      }
    };
    fetchAutores();
  }, []);

  // Buscar autores en función del debounce
  useEffect(() => {
    if (debouncedSearch) {
      buscarAutores(debouncedSearch);
    }
  }, [debouncedSearch]);

  const buscarAutores = async (nombre) => {
    try {
      const response = await axios.get("http://localhost:3000/autores/buscar", {
        params: { nombre },
      });
      setAutores(response.data.autores || []);
    } catch (error) {
      console.error("Error al buscar autores:", error);
      setAutores([]);
    }
  };

  // Eliminar autor
  const eliminarAutor = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/autores/${id}`, {
        headers: getAuthHeaders(),
      });
      setAutores((prev) => prev.filter((autor) => autor._id !== id));
      setAutorEliminando(null);
    } catch (error) {
      console.error("Error al eliminar autor:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Gestión de Autores</h1>

      {Cookies.get("token") && (
        <div className="mb-4">
          <Link to="/autores/crear" className="btn btn-primary">
            Crear Autor
          </Link>
        </div>
      )}

      <form className="my-4 w-75 mx-auto">
        <legend>Buscar Autor</legend>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre"
          />
        </div>
      </form>

      <section className="section">
        <h2>Lista de Autores</h2>
        <ul className="list-group">
          {autores.map((autor) => (
            <li
              key={autor._id}
              className="list-group-item d-flex justify-content-between"
            >
              <Link
                to={`/autores/${autor._id}`}
                className="link-offset-2 link-underline link-underline-opacity-0 text-black fw-bold"
              >
                {autor.nombre}
              </Link>
              {(user?.rol === "admin" || user?.rol === "editor") && (
                <div>
                  <Link
                    to={`/autores/editar/${autor._id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </Link>
                  {user?.rol === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setAutorEliminando(autor)}
                      data-bs-toggle="modal"
                      data-bs-target="#confirmarEliminarModal"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Modal para Confirmar Eliminación */}
      <div
        className="modal fade"
        id="confirmarEliminarModal"
        tabIndex="-1"
        aria-labelledby="confirmarEliminarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmarEliminarModalLabel">
                Confirmar Eliminación
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              ¿Estás seguro de que deseas eliminar al autor{" "}
              <strong>{autorEliminando?.nombre}</strong>?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => eliminarAutor(autorEliminando._id)}
                data-bs-dismiss="modal"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autores;
