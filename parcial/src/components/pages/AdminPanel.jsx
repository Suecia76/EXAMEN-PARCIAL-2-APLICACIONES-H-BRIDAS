import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AdminPanel = () => {
  const [users, setUsers] = useState([]); // Estado para la lista de usuarios
  const [error, setError] = useState(null); // Estado para manejar errores

  // Efecto para obtener los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get("token"); // Obtiene el token de las cookies
      if (!token) {
        setError("No se ha encontrado un token válido");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`, // Usa el token de las cookies
          },
        });
        const filteredUsers = response.data.filter(
          (user) => user.rol !== "admin"
        ); // Filtra administradores
        setUsers(filteredUsers); // Asigna solo los usuarios no administradores
      } catch (err) {
        setError("Error al obtener la lista de usuarios");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Función para actualizar el rol de un usuario
  const handleRoleChange = async (userId, newRole) => {
    const token = Cookies.get("token"); // Obtiene el token de las cookies
    if (!token) {
      setError("No se ha encontrado un token válido");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/usuarios/${userId}`,
        { rol: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualiza el estado local después de cambiar el rol
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, rol: newRole } : user
        )
      );
    } catch (err) {
      setError("Error al actualizar el rol del usuario");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h1>AdminPanel</h1>

      {error && <p className="text-danger">{error}</p>}

      <section>
        <h2>Lista de usuarios</h2>
        {users.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.rol}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="comun">Común</option>
                      <option value="editor">Editor</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios disponibles.</p>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
