import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AutorDetalle = () => {
  const { id } = useParams(); // Obtener el ID del autor desde la URL
  const [autor, setAutor] = useState(null);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = Cookies.get("token") || null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    obtenerAutor();
  }, [id]);

  const obtenerAutor = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/autores/${id}`, {
        headers: getAuthHeaders(),
      });
      setAutor(response.data);
    } catch (error) {
      console.error("Error al obtener el autor:", error);
      setError("No se pudo cargar la información del autor.");
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/autores" className="btn btn-secondary">
          Volver a la lista de autores
        </Link>
      </div>
    );
  }

  if (!autor) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando información del autor...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 p-3">Detalles del Autor</h1>
      <div className="card">
        <div className="card-header botones text-white">
          <h2>{autor.nombre}</h2>
        </div>
        <div className="card-body color-fondo">
          <p>
            <strong>Edad:</strong> {autor.edad}
          </p>
          <p>
            <strong>Libros:</strong>
          </p>
          {autor.libros && autor.libros.length > 0 ? (
            <ul>
              {autor.libros.map((libro, index) => (
                <li key={index}>{libro}</li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron libros.</p>
          )}

          <Link
            to="/autores"
            className="btn btn-primary botones border border-warning m-3"
          >
            Volver a la lista de autores
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AutorDetalle;
