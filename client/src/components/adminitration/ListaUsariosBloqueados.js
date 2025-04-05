import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import UserCard from "../UserCard";
import moment from "moment";
import { unBlockUser } from "../../redux/actions/userBlockAction";

const ListaUsuariosBloqueados = () => {
  const dispatch = useDispatch();
  const { userBlockReducer, auth } = useSelector((state) => state);
  
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Sincronizar el estado local con Redux
  useEffect(() => {
    setBlockedUsers(userBlockReducer.blockedUsers || []);
  }, [userBlockReducer.blockedUsers]);

  const formatDate = (date) => (date ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A");

  const handleDesbloqueo = (user) => {
    const datosDesbloqueo = {
      motivo: "Desbloqueo manual",
      fechaBloqueo: new Date().toISOString(),
      fechaLimite: null
    };

    dispatch(unBlockUser({ auth, datosDesbloqueo, user }));

    // Filtra la lista para eliminar al usuario desbloqueado y actualizar la UI
    setBlockedUsers((prev) => prev.filter((block) => block.user._id !== user._id));
  };

  return (
    <div className="modalusersearchlist">
      <div className="headersearchlist">
        <h5 className="titlesearchlist">Usuarios bloqueados</h5>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Motivo del bloqueo</th>
              <th>Fecha de bloqueo</th>
              <th>Fecha límite</th>
              <th>Administrador</th>
              <th>Duración</th>
              <th>Tipo de bloqueo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blockedUsers.length > 0 ? (
              blockedUsers.map((block, index) => (
                <tr key={block.user._id}>
                  <td>{index + 1}</td>
                  <td><UserCard user={block.user} /></td>
                  <td>{block.user?.email}</td>
                  <td>{block.motivo || "No especificado"}</td>
                  <td>{formatDate(block.fechaBloqueo)}</td>
                  <td>{formatDate(block.fechaLimite)}</td>
                  <td>{block.userquibloquea?.username || "inconu"}</td>
                  <td>{block.duracion || "No especificado"}</td>
                  <td>{block.tipoBloqueo || "N/A"}</td>
                  <td>
                    <div className="action-dropdown">
                      <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Acción
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={() => handleDesbloqueo(block.user)}>
                          Desbloquear
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No hay usuarios bloqueados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaUsuariosBloqueados;
