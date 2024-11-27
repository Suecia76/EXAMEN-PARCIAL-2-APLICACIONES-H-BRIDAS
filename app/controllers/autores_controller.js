import autor from "../models/autores.js";

// Obtener todos los autores
export const get_autores = async (req, res) => {
  try {
    const autores = await autor.find();
    res.json(autores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Crear un nuevo autor
export const create_autores = async (req, res) => {
  try {
    // Validación de los datos en req.body
    const newAutor = new autor({ ...req.body });
    const savedAutor = await newAutor.save();
    res.json(savedAutor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un autor por su ID
export const get_autores_id = async (req, res) => {
  try {
    const autorEncontrado = await autor.findById(req.params.id);
    if (!autorEncontrado)
      return res.status(404).json({ error: "Autor no encontrado" });
    res.json(autorEncontrado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un autor por su ID
export const update_autores = async (req, res) => {
  try {
    const autorActualizado = await autor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!autorActualizado)
      return res.status(404).json({ error: "Autor no encontrado" });
    res.json(autorActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un autor por su ID
export const delete_autores = async (req, res) => {
  try {
    const autorEliminado = await autor.findByIdAndDelete(req.params.id);
    if (!autorEliminado)
      return res.status(404).json({ error: "Autor no encontrado" });
    res.json(autorEliminado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Búsqueda de autores por nombre
export const busqueda_nombre_autores = async (req, res) => {
  try {
    const nombre = req.query.nombre || "";
    if (!nombre) {
      return res
        .status(400)
        .json({ error: "Por favor proporciona un nombre para buscar." });
    }
    const filtro = { nombre: { $regex: `^${nombre}`, $options: "i" } };
    const autores = await autor.find(filtro);
    res.json({ autores });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Paginado de autores
export const paginado_autores = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const skip = (pagina - 1) * limite;

    const autores = await autor.find().skip(skip).limit(limite);
    const total_autores = await autor.countDocuments();
    const total_paginas = Math.ceil(total_autores / limite);

    res.json({
      autores,
      pagina: pagina,
      numero_paginas: total_paginas,
      total_autores,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
