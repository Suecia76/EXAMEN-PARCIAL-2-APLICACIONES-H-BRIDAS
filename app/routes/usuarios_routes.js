import express from "express";
import auth from "../middlewares/auth_middleware.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/usuarios_controller.js";

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", auth, getAllUsers);

// Ruta para crear un nuevo usuario
router.post("/registrar", createUser);

// Ruta para iniciar sesión (login)
router.post("/login", loginUser);

// Ruta para actualizar un usuario por ID
router.put("/:id", auth, updateUser);

// Ruta para eliminar un usuario por ID
router.delete("/:id", auth, deleteUser);

// Ruta para obtener un usuario por ID
router.get("/:id", auth, getUserById);
export default router;
