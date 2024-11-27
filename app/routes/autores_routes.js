import express from "express";
import auth from "../middlewares/auth_middleware.js";
import {
  create_autores,
  get_autores,
  get_autores_id,
  update_autores,
  delete_autores,
  busqueda_nombre_autores,
  paginado_autores,
} from "../controllers/autores_controller.js";

const router = express.Router();

// Obtener todos los autores
router.get("/", get_autores);

// Crear autores nuevos
router.post("/", auth, create_autores);

// Filtros: Búsqueda por nombre
router.get("/buscar", busqueda_nombre_autores);

// Paginado de autores
router.get("/paginado", paginado_autores);

// Obtener un autor por su ID
router.get("/:id", get_autores_id);

// Actualizar un autor por su ID
router.put("/:id", auth, update_autores);

// Eliminar un autor por su ID
router.delete("/:id", auth, delete_autores);
export default router;
