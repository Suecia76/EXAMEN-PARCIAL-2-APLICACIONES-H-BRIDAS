import libro from "../models/libro.js";

export const get_libros = async (req, res) => {
  try {
    const libros = await libro.find();
    res.json(libros);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const create_libros = async (req, res) => {
  try {
    //agregar validacion a lo que me pasan por el req.body
    const libros = new libro({ ...req.body });
    const new_libro = await libros.save();
    res.json(new_libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const get_libros_id = async (req, res) => {
  try {
    const libros = await libro.findById(req.params.id);
    if (!libros) return res.status(404);
    res.json(libros);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const update_libros = async (req, res) => {
  try {
    const libro_actualizado = await libro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(libro_actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const delete_libros = async (req, res) => {
  try {
    const libro_eliminado = await libro.findByIdAndDelete(req.params.id);
    res.json(libro_eliminado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const search_genero_libros = async (req, res) => {
  try {
    const generos = req.body.generos.split(",");
    const libro_genero = await libro.find({ genero: { $in: generos } });
    res.json(libro_genero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const paginado = async (req, res) => {
  try {
    //declare la pagina y el limite de documentos que aparecen en la peticion
    //doy la opcion de que me pasen los limites y las paginas y sino me pasan nada tiene un valor por defecto
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    //declaro skip, que lo que hace es restar la pagina actual por 1 y y mutltiplicar por el limite
    //así me va a dar la cantidad de documentos a saltear
    const skip = (pagina - 1) * limite;

    //luego declaro libros en el que busco los libros existentes y salteo la cantidad calculada anteriormente y limito
    //cuantos quiero que aparezcan
    const libros = await libro.find().skip(skip).limit(limite);

    //luego calculo la cantidad de libros existentes con la funcion countDocuments
    const total_libros = await libro.countDocuments();

    //para luego poder calcular cuantas paginas hay
    const total_paginas = Math.ceil(total_libros / limite);

    //por ultimo devuelvo los libros, la pagina, el total de pagina y el total de libros
    res.json({
      libros,
      pagina: pagina,
      numero_paginas: total_paginas,
      total_libros,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const busqueda_nombre = async (req, res) => {
  try {
    const titulo = req.query.titulo || "";
    if (!titulo) {
      return res
        .status(400)
        .json({ error: "Por favor proporciona un titulo para buscar." });
    }
    const filtro = { titulo: { $regex: `^${titulo}`, $options: "i" } };
    const libros = await libro.find(filtro);
    res.json({
      libros,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
