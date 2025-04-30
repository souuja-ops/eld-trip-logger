import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function Map({ route }) {
  // Default center position (e.g., London) if no route is provided
  const defaultPosition = [51.505, -0.09];
  const center = route?.waypoints?.[0]?.location || defaultPosition;

  return (
    <div style={{ height: "500px", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {route?.waypoints && (
          <>
            {/* Route Polyline */}
            <Polyline
              positions={route.waypoints.map((wp) => wp.location)}
              color="#3b82f6"
              weight={4}
            />

            {/* Markers */}
            {route.waypoints.map((wp, index) => (
              <Marker key={index} position={wp.location}>
                <Popup>
                  <b>{wp.label}</b>
                  <br />
                  {wp.timestamp && new Date(wp.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}