import React from "react";
import { useSelector } from "react-redux";

const BlockedPage = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="text-center p-10">
      <h2 className="text-red-600 text-2xl font-bold">🚫 Acceso Restringido</h2>
      <p className="text-gray-600 mt-3">
        Tu cuenta ha sido bloqueada temporalmente.
      </p>
      <p className="text-gray-500 mt-2">
        📅 Bloqueado hasta: <strong>{user?.fechaDesbloqueo}</strong>
      </p>
      <p className="text-gray-500 mt-2">
        📢 Motivo: <strong>{user?.motivoBloqueo}</strong>
      </p>
    </div>
  );
};

export default BlockedPage;
