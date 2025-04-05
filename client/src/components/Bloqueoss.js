import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';  // Usamos useSelector para acceder al estado global

const Bloqueoss = () => {
    const { auth, userBlockReducer } = useSelector(state => state);  // Accedemos al estado global
    const user = auth.user;  // Suponiendo que el usuario está dentro del estado auth

    // Verificamos si el usuario está bloqueado
    const isBlocked = userBlockReducer.blockedUsers.some(blockedUser => blockedUser.user._id === user._id && blockedUser.esBloqueado);

    useEffect(() => {
        if (!auth.token) {
            // Si no hay token, redirigir o mostrar algún mensaje
            console.log("No estás autenticado");
        }
    }, [auth.token]);

    // Si el usuario está bloqueado, mostramos los detalles
    return (
        <div className="bloqueo-container">
            {isBlocked ? (
                <div className="bloqueo-card">
                    <h2>نظام الحجب العقاري يعلم </h2>
                    <div className="bloqueo-info">
                        <div className="bloqueo-item">
                            <span className="label">اسم المستخدم: </span>
                            <span className="value">{user.username}</span>
                        </div>
                        <div className="bloqueo-item">
                            <span className="label">سبب للحظر: </span>
                            <span className="value">{userBlockReducer.blockedUsers.find(blockedUser => blockedUser.user._id === user._id)?.motivo || 'No disponible'}</span>
                        </div>
                        <div className="bloqueo-item">
                            <span className="label">تاريخ القفل: </span>
                            <span className="value">
                                {new Date(userBlockReducer.blockedUsers.find(blockedUser => blockedUser.user._id === user._id)?.fechaBloqueo).toLocaleDateString() || 'No disponible'}
                            </span>
                        </div>
                        <div className="bloqueo-item">
                            <span className="label">تاريخ انتهاء الحصار: </span>
                            <span className="value">
                                {userBlockReducer.blockedUsers.find(blockedUser => blockedUser.user._id === user._id)?.fechaLimite 
                                    ? new Date(userBlockReducer.blockedUsers.find(blockedUser => blockedUser.user._id === user._id)?.fechaLimite).toLocaleDateString()
                                    : 'No disponible'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bloqueo-card">
                    <h2>Utilizateur et desbloque</h2>
                </div>
            )}
        </div>
    );
};

export default Bloqueoss;
