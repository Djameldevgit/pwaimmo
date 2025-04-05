import React, { useState, useEffect } from "react";
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

const Map = ({ post }) => {
  const [mapCenter, setMapCenter] = useState([36.5, 3.5]);
  const [markerPosition, setMarkerPosition] = useState([36.5, 3.5]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapStyle, setMapStyle] = useState("street");

  // Proveedores de mapas
  const mapProviders = {
    street: {
      name: "Mapa Callejero",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    satellite: {
      name: "Vista Satélite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.arcgis.com/">Esri</a>'
    }
  };

  useEffect(() => {
    if (post?.wilaya) {
      getBestAvailableLocation();
    }
  }, [post?.quartier, post?.commune, post?.wilaya]);

  const getBestAvailableLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query, detectedPrecision;
      
      if (post?.quartier && post.quartier.trim() !== "") {
        query = `${post.quartier}, ${post.commune}, ${post.wilaya}, Algeria`;
        detectedPrecision = 'quartier';
        setZoomLevel(16);
      } else if (post?.commune && post.commune.trim() !== "") {
        query = `${post.commune}, ${post.wilaya}, Algeria`;
        detectedPrecision = 'commune';
        setZoomLevel(14);
      } else {
        query = `${post.wilaya}, Algeria`;
        detectedPrecision = 'wilaya';
        setZoomLevel(12);
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your@email.com)'
        }
      });
      
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
        setMarkerPosition([lat, lon]);
      } else {
        if (detectedPrecision === 'quartier') {
          await getLocationFallback('commune');
        } else if (detectedPrecision === 'commune') {
          await getLocationFallback('wilaya');
        } else {
          setError("Ubicación no encontrada. Mostrando mapa de Argelia.");
        }
      }
    } catch (error) {
      console.error("Error al obtener ubicación:", error);
      setError("No se pudo cargar la ubicación. Intente recargar la página.");
    } finally {
      setLoading(false);
    }
  };

  const getLocationFallback = async (level) => {
    try {
      let query;
      if (level === 'commune' && post?.commune) {
        query = `${post.commune}, ${post.wilaya}, Algeria`;
        setZoomLevel(14);
      } else {
        query = `${post.wilaya}, Algeria`;
        setZoomLevel(12);
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your@email.com)'
        }
      });
      
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
        setMarkerPosition([lat, lon]);
      } else {
        setError("Ubicación no encontrada. Mostrando mapa de Argelia.");
      }
    } catch (error) {
      console.error(`Error al obtener ubicación por ${level}:`, error);
      setError("Error al cargar la ubicación. Mostrando mapa de Argelia.");
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: "800px",
      margin: "20px auto",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Encabezado y controles visibles */}
      <div style={{
        padding: "15px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px 8px 0 0",
        borderBottom: "1px solid #ddd"
      }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>📍 Localisation de la Propriété</h3>
        
        {/* Información de ubicación siempre visible */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "5px 0" }}>
            <strong>Wilaya:</strong> {post?.wilaya || "No especificada"}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Commune:</strong> {post?.commune || "No especificada"}
          </p>
          {post?.quartier && (
            <p style={{ margin: "5px 0", fontWeight: "bold" }}>
              <strong>Quartier:</strong> {post.quartier}
            </p>
          )}
        </div>

        {/* Botones de control siempre visibles */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px"
        }}>
          <button 
            onClick={() => setMapStyle("street")}
            style={{
              padding: "8px 15px",
              backgroundColor: mapStyle === "street" ? "#2c3e50" : "#e0e0e0",
              color: mapStyle === "street" ? "white" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
           Vue map
          </button>
          <button 
            onClick={() => setMapStyle("satellite")}
            style={{
              padding: "8px 15px",
              backgroundColor: mapStyle === "satellite" ? "#2c3e50" : "#e0e0e0",
              color: mapStyle === "satellite" ? "white" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Vue satellite
          </button>
        </div>
      </div>

      {/* Mensajes de estado */}
      {loading && (
        <div style={{
          padding: "10px",
          backgroundColor: "#e3f2fd",
          textAlign: "center"
        }}>
          Chargement de mape...
        </div>
      )}
      {error && (
        <div style={{
          padding: "10px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {/* Contenedor del mapa con altura fija */}
      <div style={{
        height: "500px",
        width: "100%",
        position: "relative",
        zIndex: 1
      }}>
        <MapContainer 
          center={mapCenter} 
          zoom={zoomLevel} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          zoomControl={true}
          key={mapStyle} // Fuerza recreación al cambiar estilo
        >
          <ChangeView center={mapCenter} zoom={zoomLevel} />
          <TileLayer
            url={mapProviders[mapStyle].url}
            attribution={mapProviders[mapStyle].attribution}
          />
          <Marker position={markerPosition}>
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong>Localisation exacte:</strong><br />
                {post?.quartier && <span>Barrio: {post.quartier}<br /></span>}
                {post?.commune && <span>Comuna: {post.commune}<br /></span>}
                {post?.wilaya && <span>Wilaya: {post.wilaya}</span>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;