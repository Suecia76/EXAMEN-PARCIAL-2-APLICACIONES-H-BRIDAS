import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  contraseña: { type: String, required: true },
  rol: { type: String, required: true, default: "usuario comun" },
});

export default mongoose.model("Usuario", UsuarioSchema);
