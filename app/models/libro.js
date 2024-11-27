import mongoose from "mongoose";

const LibroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  publicado: { type: String, default: Date.now },
  synopsis: { type: String, required: true },
  genero: [{ type: String }],
});

export default mongoose.model("libros", LibroSchema);
