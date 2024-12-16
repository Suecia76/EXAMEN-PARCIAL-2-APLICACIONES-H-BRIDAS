import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Cookies from "js-cookie";
import estilos from "./navBar.module.css";

// Componente NavBar
const NavBar = () => {
  const { user, logout } = useContext(UserContext); // Accede al contexto
  const navigate = useNavigate();
  const token = Cookies.get("token") || null;

  const handleLogout = () => {
    logout(); // Llama a la función de logout proporcionada por el contexto
    navigate("/"); // Redirige al usuario a la página de inicio o login
  };

  return (
    <nav className={`navbar navbar-expand-lg  ${estilos["fondo"]}`}>
      <div className="container-fluid">
        <NavLink to={"/"} className="navbar-brand text-white">
          Home
        </NavLink>
        <button
          className={`navbar-toggler ${estilos["navbar-toggler"]}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span
            className={`navbar-toggler-icon ${estilos["icon-white"]}`}
          ></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link text-white" to={"/autores"}>
                Autores
              </NavLink>
            </li>
            {!token ? (
              <li className="nav-item">
                <NavLink className="nav-link text-white" to={"/iniciar_sesion"}>
                  Inicio de sesión
                </NavLink>
              </li>
            ) : (
              <>
                {/* Mostrar "Panel de administración" solo si el usuario es admin */}
                {user.rol === "admin" && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link text-white"
                      to={"/admin_panel"}
                    >
                      Panel de Administración
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="nav-link btn text-white"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
