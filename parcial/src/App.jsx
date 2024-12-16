import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  Libros,
  LibroView,
  Autores,
  AutorView,
  LoginUsuario,
  RegistroUsuario,
  CrearLibro,
  EditarLibro,
  AdminPanel,
  CrearAutor,
  EditarAutor,
} from "./components";

import "./App.css";

function NotFound() {
  return <h1>404: No se encontro la pantalla</h1>;
}

function App() {
  return (
    <>
      <div>
        <NavBar></NavBar>
      </div>
      <Routes>
        <Route path="/" element={<Libros />} />
        <Route path="/libros/crear" element={<CrearLibro />} />
        <Route path="/libros/editar/:id" element={<EditarLibro />} />
        <Route path="/autores" element={<Autores />} />
        <Route path="/autores/crear" element={<CrearAutor />} />
        <Route path="/autores/editar/:id" element={<EditarAutor />} />
        <Route path="/autores/:id" element={<AutorView />} />
        <Route path="/admin_panel" element={<AdminPanel />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/iniciar_sesion" element={<LoginUsuario />} />
        <Route path="/libros/:id" element={<LibroView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
