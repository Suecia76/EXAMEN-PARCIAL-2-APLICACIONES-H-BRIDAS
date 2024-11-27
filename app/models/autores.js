import mongoose from "mongoose";

const AutoresSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: String, required: true },
  libros: [{ type: String, required: true }],
});

export default mongoose.model("autor", AutoresSchema);
