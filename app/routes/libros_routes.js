import express from "express";
import auth from "../middlewares/auth_middleware.js";
import {
  create_libros,
  get_libros,
  get_libros_id,
  update_libros,
  delete_libros,
  search_genero_libros,
  paginado,
  busqueda_nombre,
} from "../controllers/libro_controller.js";

const router = express.Router();

// Obtener todos los libros
router.get("/", get_libros);

// Obtener todos los libros con paginado
router.get("/paginado", paginado);

// Obtener libro segun titulo
router.get("/buscar/nombre", busqueda_nombre);

// Crear libros nuevos
router.post("/", auth, create_libros);

// Búsqueda de libros por género
router.post("/buscar/genero", search_genero_libros);

// Obtener un libro por su ID
router.get("/:id", get_libros_id);

// Actualizar un libro por su ID
router.put("/:id", auth, update_libros);

// Eliminar un libro por su ID
router.delete("/:id", auth, delete_libros);
export default router;
