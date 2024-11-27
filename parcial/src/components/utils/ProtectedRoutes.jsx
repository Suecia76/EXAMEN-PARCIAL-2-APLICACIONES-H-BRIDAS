import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { token } = useContext(UserContext);
  let authenticated = { token: token };
  return authenticated.token ? <Outlet /> : <Navigate to="/iniciar_sesion" />;
};

export default ProtectedRoutes;
