import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { UserContext } from "../../context/UserContext";

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    edad: "",
    libros: "",
  });
  const [search, setSearch] = useState("");
  const [autorEditando, setAutorEditando] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

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
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Crear o editar autor
  const manejarFormulario = async (e) => {
    e.preventDefault();
    const { nombre, edad, libros } = formulario;
    const autorData = {
      nombre,
      edad: parseInt(edad),
      libros: libros.split(",").map((libro) => libro.trim()),
    };

    try {
      if (autorEditando) {
        const response = await axios.put(
          `http://localhost:3000/autores/${autorEditando._id}`,
          autorData,
          { headers: getAuthHeaders() }
        );
        setAutores((prev) =>
          prev.map((autor) =>
            autor._id === autorEditando._id ? response.data : autor
          )
        );
        setAutorEditando(null);
      } else {
        const response = await axios.post(
          "http://localhost:3000/autores",
          autorData,
          {
            headers: getAuthHeaders(),
          }
        );
        setAutores((prev) => [...prev, response.data]);
      }
      setFormulario({ nombre: "", edad: "", libros: "" });
    } catch (error) {
      console.error("Error al manejar autor:", error);
    }
  };

  // Buscar autores
  const buscarAutores = async (nombre) => {
    try {
      const response = await axios.get("http://localhost:3000/autores/buscar", {
        params: { nombre },
      });
      setSuggestions([]);
      setAutores(response.data.autores || []);
    } catch (error) {
      console.error("Error al buscar autores:", error);
      setAutores([]);
    }
  };

  // Manejar clic en sugerencias
  const manejarClicSugerencia = (nombre) => {
    setSearch(nombre);
    buscarAutores(nombre);
  };

  // Eliminar autor
  const eliminarAutor = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/autores/${id}`, {
        headers: getAuthHeaders(),
      });
      setAutores((prev) => prev.filter((autor) => autor._id !== id));
    } catch (error) {
      console.error("Error al eliminar autor:", error);
    }
  };

  // Editar autor
  const editarAutor = (autor) => {
    setFormulario({
      nombre: autor.nombre,
      edad: autor.edad.toString(),
      libros: autor.libros.join(", "),
    });
    setAutorEditando(autor);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Gestión de Autores</h1>

      {Cookies.get("token") && (
        <form
          onSubmit={manejarFormulario}
          className="mb-4 shadow p-3 rounded w-75 mx-auto"
        >
          <legend className="fw-bold">
            {autorEditando ? "Editar Autor" : "Crear Autor"}
          </legend>
          {["nombre", "edad", "libros"].map((campo) => (
            <div key={campo} className="mb-3 w-75 mx-auto">
              <label className="fw-bold w-100 my-2">
                {campo.charAt(0).toUpperCase() + campo.slice(1)}:
                <input
                  type="text"
                  name={campo}
                  className="form-control"
                  value={formulario[campo]}
                  onChange={handleInputChange}
                  placeholder={`Ingrese ${campo}`}
                />
              </label>
            </div>
          ))}
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" type="submit">
              {autorEditando ? "Actualizar Autor" : "Agregar Autor"}
            </button>
          </div>
        </form>
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
        {suggestions.length > 0 && (
          <ul className="list-group mt-2">
            {suggestions.map((sug) => (
              <li
                key={sug._id}
                className="list-group-item"
                onClick={() => manejarClicSugerencia(sug.nombre)}
              >
                {sug.nombre}
              </li>
            ))}
          </ul>
        )}
      </form>

      <section className="section">
        <h2>Lista de Autores</h2>
        <ul className="list-group">
          {autores.map((autor) => (
            <li
              key={autor._id}
              className="list-group-item d-flex justify-content-between"
            >
              <Link to={`/autores/${autor._id}`} className="fw-bold">
                {autor.nombre}
              </Link>
              {(user?.rol === "admin" || user?.rol === "editor") && (
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarAutor(autor)}
                  >
                    Editar
                  </button>
                  {user?.rol === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarAutor(autor._id)}
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
    </div>
  );
};

export default Autores;
