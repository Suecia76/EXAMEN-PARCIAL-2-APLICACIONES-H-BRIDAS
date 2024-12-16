import React from "react";

const ConfirmarEliminacionAutor = ({ autor, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content p-4">
        <h5 className="modal-title">Confirmar Eliminación</h5>
        <p>¿Estás seguro de que deseas eliminar al autor "{autor.nombre}"?</p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger me-2" onClick={onConfirm}>
            Eliminar
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarEliminacionAutor;
