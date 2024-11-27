import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// Crear el contexto
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: null,
    nombre: "",
    email: "",
    rol: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser); // Establece los datos del usuario
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        Cookies.remove("token"); // Limpia el token inválido
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    // Eliminar el token y limpiar el estado del usuario
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
