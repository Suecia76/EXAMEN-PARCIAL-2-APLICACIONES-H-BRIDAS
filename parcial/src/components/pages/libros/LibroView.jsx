import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LibroView = () => {
  const { id } = useParams();
  const [libro, setLibro] = useState({
    titulo: "",
    autor: "",
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  const libro_detalles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/libros/${id}`, {
        params: {
          name: search,
          status: filterStatus,
          sortBy: sort,
          page,
          limit,
        },
      });
      setLibro(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    libro_detalles();
  }, [id, search, filterStatus, sort, page, limit]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="m-3">
      <h1>{libro.titulo}</h1>
      <p>
        <span className="fw-bold">Escrito por:</span> {libro.autor}
      </p>
      <p>
        <span className="fw-bold">Genero de la publicación:</span>{" "}
        {libro.genero}
      </p>
      <p>
        <span className="fw-bold">Fecha de publicación:</span> {libro.publicado}
      </p>
      <p className="fw-bold">Sinopsis:</p>
      <p>{libro.synopsis}</p>
    </div>
  );
};

export default LibroView;
