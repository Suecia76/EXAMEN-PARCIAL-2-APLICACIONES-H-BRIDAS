import NavBar from "./components/navBar";
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

        <Route path="/autores" element={<Autores />} />

        <Route path="/autores/:id" element={<AutorView />} />

        <Route path="/registro" element={<RegistroUsuario />} />

        <Route path="/iniciar_sesion" element={<LoginUsuario />} />

        <Route path="/libros/:id" element={<LibroView />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
