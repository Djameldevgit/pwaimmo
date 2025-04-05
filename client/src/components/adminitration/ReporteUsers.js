import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReports,
  getMostReportedUsers,
  getMostActiveReporters,
} from "../../redux/actions/reportUserAction";

const ReportedUsers = () => {
  const dispatch = useDispatch();
  const { reportReducer, auth } = useSelector((state) => state);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await dispatch(getReports(auth.token));
      } catch (err) {
        setError("Error al obtener los reportes.");
      }
    };
    fetchReports();
  }, [dispatch, auth.token]);

  const { reports, loading } = reportReducer;

  return (
    <div className="reported-users container">
      <h2 className="my-4">Usuarios Reportados</h2>

      {loading ? (
        <p>Cargando reportes...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : reports.length === 0 ? (
        <p>No hay usuarios reportados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>ID Reporte</th>
                <th>Usuario que Reporta</th>
                <th>Usuario Reportado</th>
                <th>Título del Post</th>
                <th>Contenido del Post</th>
                <th>Razón</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="p-2">{report._id}</td>
                  <td className="p-2">
                    <UserInfo user={report.reportedBy} />
                  </td>
                  <td className="p-2">
                    <UserInfo user={report.userId} />
                  </td>
                  <td className="p-2">{report.postId?.title || "N/A"}</td>
                  <td className="p-2">
                    {report.postId?.content
                      ? report.postId.content.slice(0, 50) + "..."
                      : "Publicación eliminada"}
                  </td>
                  <td className="p-2">{report.reason}</td>
                  <td className="p-2">{report.status || "Pendiente"}</td>
                  <td className="p-2">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <DropdownActions report={report} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const { mostReportedUsers, mostActiveReporters } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(getMostReportedUsers());
    dispatch(getMostActiveReporters());
  }, [dispatch]);

  return (
    <div className="container">
      <h2 className="my-4">Usuarios Más Reportados</h2>
      <ul className="list-group">
        {mostReportedUsers.map((user) => (
          <li key={user._id} className="list-group-item d-flex align-items-center">
            <img
              src={user.user.avatar}
              alt={user.user.username}
              className="rounded-circle mr-2"
              width="40"
            />
            {user.user.username} - {user.count} reportes
          </li>
        ))}
      </ul>

      <h2 className="my-4">Usuarios Más Activos Reportando</h2>
      <ul className="list-group">
        {mostActiveReporters.map((user) => (
          <li key={user._id} className="list-group-item d-flex align-items-center">
            <img
              src={user.user.avatar}
              alt={user.user.username}
              className="rounded-circle mr-2"
              width="40"
            />
            {user.user.username} - {user.count} reportes hechos
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserInfo = ({ user }) => {
  return user ? (
    <div className="user-info d-flex align-items-center">
      <img
        src={user.avatar}
        alt={user.username}
        className="user-avatar rounded-circle mr-2"
        width="30"
        height="30"
      />
      <span>{user.username}</span>
    </div>
  ) : (
    <span>Usuario desconocido</span>
  );
};

const DropdownActions = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-danger dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⋮
      </button>
      {isOpen && (
        <div className="dropdown-menu show">
          <button className="dropdown-item">✏️ Editar</button>
          <button className="dropdown-item text-danger">🗑️ Eliminar</button>
          <button className="dropdown-item text-warning">🚫 Bloquear</button>
          <button className="dropdown-item text-warning">🔇 Silenciar</button>
          <button className="dropdown-item">📩 Enviar mensaje</button>
          <button className="dropdown-item">👤 Ver perfil</button>
          <button className="dropdown-item">🚨 Ver reportes</button>
          <button className="dropdown-item text-info">
            🔑 Iniciar sesión como usuario
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportedUsers;
