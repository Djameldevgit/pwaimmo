import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const EstadoActividadUser = () => {
  const { socket, auth } = useSelector((state) => state);
  const [userLocation, setUserLocation] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);

  // 1. Obtener la ubicación del usuario actual y enviarla al servidor
  const startTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // Enviar al servidor (primera vez)
          if (!userLocation) {
            socket.emit("register_user", {
              userId: auth.user._id,
              location,
              name: auth.user.name
            });
          }
          
          // Actualización continua
          socket.emit("update_location", {
            userId: auth.user._id,
            location
          });
        },
        (error) => console.error("Error de GPS:", error),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }
  };

  // 2. Escuchar actualizaciones de otros usuarios
  useEffect(() => {
    socket.on("active_users", (users) => {
      setOtherUsers(users.filter(user => user.userId !== auth.user._id));
    });

    socket.on("location_updated", ({ userId, location }) => {
      setOtherUsers(prev => 
        prev.map(user => 
          user.userId === userId ? { ...user, location } : user
        )
      );
    });

    socket.on("user_disconnected", (userId) => {
      setOtherUsers(prev => prev.filter(user => user.userId !== userId));
    });

    return () => {
      socket.off("active_users");
      socket.off("location_updated");
      socket.off("user_disconnected");
    };
  }, [auth.user._id, socket]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📍 Seguimiento en Tiempo Real</h2>
      <button 
        onClick={startTracking}
        style={{ padding: "10px 15px", marginBottom: "20px" }}
      >
        Activar Seguimiento
      </button>

      <div style={{ height: "500px", width: "100%" }}>
        {userLocation ? (
          <MapContainer 
            center={[userLocation.lat, userLocation.lng]} 
            zoom={15} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Marcador del usuario actual */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Tú ({auth.user.name})</Popup>
            </Marker>
            
            {/* Marcadores de otros usuarios */}
            {otherUsers.map((user) => (
              <Marker 
                key={user.userId} 
                position={[user.location.lat, user.location.lng]}
              >
                <Popup>{user.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p>Esperando ubicación...</p>
        )}
      </div>
    </div>
  );
};

export default EstadoActividadUser;