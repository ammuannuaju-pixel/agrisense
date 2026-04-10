import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

// Fix default marker icon broken in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function FieldMapPicker({ value, onChange }) {
  // Default center: Kerala
  const defaultCenter = [10.8505, 76.2711];
  const position = value ? [value.lat, value.lng] : null;

  return (
    <div>
      <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>
        Field Location <span style={{ color: "#aaa" }}>(click on map to pin)</span>
      </label>
      <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #e8e8e8", height: "240px" }}>
        <MapContainer
          center={defaultCenter}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <ClickHandler onPick={onChange} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      {value && (
        <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
          📍 {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          <button onClick={() => onChange(null)} style={{
            marginLeft: "10px", fontSize: "11px", color: "#e57373",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>clear</button>
        </p>
      )}
    </div>
  );
}