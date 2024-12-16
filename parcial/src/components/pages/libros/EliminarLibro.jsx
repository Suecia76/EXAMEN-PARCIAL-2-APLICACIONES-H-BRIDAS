import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EliminarLibro = ({ libroId, onConfirm, onCancel }) => {
  const [libro, setLibro] = useState(null);

  // Obtener los detalles del libro para mostrar en el modal
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/libros/${libroId}`
        );
        setLibro(response.data);
      } catch (error) {
        console.error("Error al obtener el libro:", error);
      }
    };

    if (libroId) {
      fetchLibro();
    }
  }, [libroId]);

  // Eliminar el libro
  const handleDelete = async () => {
    const token = Cookies.get("token") || null;
    try {
      await axios.delete(`http://localhost:3000/libros/${libroId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      onConfirm(); // Llamar la función de confirmación
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
    }
  };

  if (!libro) return null; // Si no se tiene el libro, no renderizar nada

  return (
    <div
      className="modal show"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Confirmar Eliminación
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onCancel}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              ¿Estás seguro de que deseas eliminar el libro "{libro.titulo}"?
            </p>
            <p>
              <strong>Autor:</strong> {libro.autor}
            </p>
            <p>
              <strong>Género:</strong> {libro.genero}
            </p>
            <p>
              <strong>Descripción:</strong> {libro.synopsis}
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
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
  );
};

export default EliminarLibro;
