import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const EstadoActividadUser = () => {
  const { socket, auth, homeUsers } = useSelector((state) => state);
  const [userLocation, setUserLocation] = useState(null);
  const [trackingUsers, setTrackingUsers] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [mapStyle, setMapStyle] = useState("street");
  const [locationError, setLocationError] = useState(null);
  const [highAccuracy, setHighAccuracy] = useState(true);

  const watchId = useRef(null);

  // Proveedores de mapas
  const mapProviders = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.arcgis.com/">Esri</a>'
    }
  };

  // Función segura para ordenar usuarios
  const sortUsersByName = (users) => {
    return [...users].sort((a, b) => {
      const nameA = a.name || ''; // Si name es undefined, usa string vacío
      const nameB = b.name || '';
      return nameA.localeCompare(nameB);
    });
  };

  // 1. Función para iniciar/parar el seguimiento
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalización no soportada por tu navegador");
      return;
    }

    setIsTracking(true);
    setLocationError(null);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        setUserLocation(location);
        
        socket.emit("update_location", {
          userId: auth.user._id,
          location,
          name: auth.user.name,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        handleLocationError(error);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: highAccuracy,
        maximumAge: 3000,
        timeout: 5000
      }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }
  };

  const handleLocationError = (error) => {
    let message = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Permiso de ubicación denegado. Por favor habilita los permisos.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Información de ubicación no disponible.";
        break;
      case error.TIMEOUT:
        message = "La solicitud de ubicación ha expirado.";
        break;
      default:
        message = "Error desconocido al obtener la ubicación.";
    }
    setLocationError(message);
  };

  // 2. Inicializar y actualizar usuarios
  useEffect(() => {
    // Inicializar con usuarios de Redux
    if (homeUsers?.users) {
      const initialUsers = homeUsers.users.map(user => ({
        userId: user._id,
        name: user.name || `Usuario ${user._id.substring(0, 6)}`, // Valor por defecto si no hay nombre
        location: user.location || null,
        accuracy: user.accuracy || null
      }));
      setTrackingUsers(initialUsers);
    }

    // Escuchar actualizaciones
    const onLocationUpdated = ({ userId, location, name, accuracy }) => {
      setTrackingUsers(prev => {
        const updatedUsers = prev.map(user => 
          user.userId === userId 
            ? { ...user, location, accuracy, name: name || user.name } 
            : user
        );
        
        if (!updatedUsers.some(u => u.userId === userId)) {
          updatedUsers.push({ 
            userId, 
            name: name || `Usuario ${userId.substring(0, 6)}`,
            location, 
            accuracy 
          });
        }
        
        return updatedUsers;
      });
    };

    socket.on("location_updated", onLocationUpdated);
    socket.on("user_disconnected", (userId) => {
      setTrackingUsers(prev => prev.filter(user => user.userId !== userId));
    });

    return () => {
      socket.off("location_updated", onLocationUpdated);
      socket.off("user_disconnected");
      stopTracking();
    };
  }, [homeUsers.users, socket]);

  // Calcular el centro del mapa
  const calculateMapCenter = () => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    
    const usersWithLocation = trackingUsers.filter(u => u.location);
    if (usersWithLocation.length > 0) {
      const avgLat = usersWithLocation.reduce((sum, user) => sum + user.location.lat, 0) / usersWithLocation.length;
      const avgLng = usersWithLocation.reduce((sum, user) => sum + user.location.lng, 0) / usersWithLocation.length;
      return [avgLat, avgLng];
    }
    
    return [36.5, 3.5]; // Default Algeria coordinates
  };

  const mapCenter = calculateMapCenter();
  const zoomLevel = 15;
  const sortedUsers = sortUsersByName(trackingUsers);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Encabezado y controles */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <h2 style={{ margin: 0 }}>📍 Seguimiento en Tiempo Real</h2>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <input 
              type="checkbox" 
              id="highAccuracy"
              checked={highAccuracy}
              onChange={() => setHighAccuracy(!highAccuracy)}
              disabled={isTracking}
            />
            <label htmlFor="highAccuracy">Alta precisión</label>
          </div>
          
          <button 
            onClick={() => setMapStyle("street")}
            style={{ 
              padding: "8px 12px",
              backgroundColor: mapStyle === "street" ? "#2c3e50" : "#e0e0e0",
              color: mapStyle === "street" ? "white" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Mapa
          </button>
          
          <button 
            onClick={() => setMapStyle("satellite")}
            style={{ 
              padding: "8px 12px",
              backgroundColor: mapStyle === "satellite" ? "#2c3e50" : "#e0e0e0",
              color: mapStyle === "satellite" ? "white" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Satélite
          </button>
          
          <button 
            onClick={toggleTracking}
            style={{ 
              padding: "8px 12px",
              backgroundColor: isTracking ? "#e74c3c" : "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {isTracking ? "Detener Seguimiento" : "Activar Seguimiento"}
          </button>
        </div>
      </div>

      {locationError && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          borderRadius: "4px",
          marginBottom: "15px"
        }}>
          {locationError}
        </div>
      )}

      {/* Mapa */}
      <div style={{ 
        height: "600px", 
        width: "100%", 
        borderRadius: "8px", 
        overflow: "hidden",
        position: "relative"
      }}>
        <MapContainer 
          center={mapCenter} 
          zoom={zoomLevel} 
          style={{ height: "100%", width: "100%" }}
          key={mapStyle}
        >
          <ChangeView center={mapCenter} zoom={zoomLevel} />
          <TileLayer
            url={mapProviders[mapStyle].url}
            attribution={mapProviders[mapStyle].attribution}
          />
          
          {/* Marcador del usuario actual */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <strong>Tú ({auth.user.name})</strong><br />
                  <div style={{ margin: "5px 0" }}>
                    <span>Lat: {userLocation.lat.toFixed(6)}</span><br />
                    <span>Lng: {userLocation.lng.toFixed(6)}</span><br />
                    <span>Precisión: ~{Math.round(userLocation.accuracy)} metros</span>
                  </div>
                  <small>Última actualización: {new Date().toLocaleTimeString()}</small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marcadores de otros usuarios */}
          {trackingUsers
            .filter(user => user.userId !== auth.user._id && user.location)
            .map((user) => (
              <Marker 
                key={user.userId} 
                position={[user.location.lat, user.location.lng]}
              >
                <Popup>
                  <div style={{ minWidth: "200px" }}>
                    <strong>{user.name}</strong>
                    <div style={{ margin: "5px 0" }}>
                      <span>Lat: {user.location.lat.toFixed(6)}</span><br />
                      <span>Lng: {user.location.lng.toFixed(6)}</span><br />
                      {user.accuracy && (
                        <span>Precisión: ~{Math.round(user.accuracy)} metros</span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Panel de información */}
      <div style={{ 
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "15px"
      }}>
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px"
        }}>
          <h3 style={{ marginTop: 0 }}>Tu Ubicación</h3>
          {userLocation ? (
            <div>
              <p><strong>Coordenadas:</strong></p>
              <p>Latitud: {userLocation.lat.toFixed(6)}</p>
              <p>Longitud: {userLocation.lng.toFixed(6)}</p>
              <p>Precisión: ~{Math.round(userLocation.accuracy)} metros</p>
              <p>Modo: {highAccuracy ? "Alta precisión" : "Baja precisión"}</p>
            </div>
          ) : (
            <p>No se está compartiendo tu ubicación</p>
          )}
        </div>
        
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px"
        }}>
          <h3 style={{ marginTop: 0 }}>Usuarios en el mapa ({trackingUsers.filter(u => u.location).length})</h3>
          <ul style={{ listStyle: "none", padding: 0, maxHeight: "200px", overflowY: "auto" }}>
            {sortedUsers.map(user => (
              <li 
                key={user.userId} 
                style={{ 
                  padding: "8px 0", 
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span>
                  {user.name} 
                  {user.userId === auth.user._id && " (Tú)"}
                </span>
                <span style={{ color: user.location ? "#2ecc71" : "#e74c3c" }}>
                  {user.location ? "Conectado" : "Sin ubicación"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EstadoActividadUser;