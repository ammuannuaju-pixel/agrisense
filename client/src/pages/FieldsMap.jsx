import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const KERALA_CENTER = [10.8505, 76.2711];

export default function FieldsMap() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("fields")
      .select("*")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .then(({ data }) => {
        setFields(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "32px", color: "#888" }}>Loading map...</p>;

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: "#1a3c1a", marginBottom: "8px" }}>Fields Map</h1>
        <p style={{ color: "#888" }}>All your pinned field locations</p>
      </div>

      {fields.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", background: "#fff",
          borderRadius: "12px", border: "1px solid #e8e8e8", color: "#888",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗺️</div>
          <p>No fields with locations yet. Add a field with a map pin from the Fields page.</p>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div style={{
            display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap",
          }}>
            {fields.map(field => (
              <div key={field.id} style={{
                background: "#fff", borderRadius: "10px", padding: "12px 16px",
                border: "1px solid #e8e8e8", fontSize: "13px",
              }}>
                <span style={{ fontWeight: "600", color: "#1a3c1a" }}>🌾 {field.name}</span>
                {field.crop && <span style={{ color: "#888", marginLeft: "8px" }}>{field.crop}</span>}
                {field.area_acres && <span style={{ color: "#aaa", marginLeft: "8px" }}>{field.area_acres} acres</span>}
              </div>
            ))}
          </div>

          {/* Map */}
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #e8e8e8", height: "520px" }}>
            <MapContainer
              center={
                fields.length === 1
                  ? [fields[0].latitude, fields[0].longitude]
                  : KERALA_CENTER
              }
              zoom={fields.length === 1 ? 13 : 9}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {fields.map(field => (
                <Marker key={field.id} position={[field.latitude, field.longitude]}>
                  <Popup>
                    <div style={{ fontFamily: "system-ui, sans-serif", minWidth: "140px" }}>
                      <strong style={{ color: "#1a3c1a", fontSize: "15px" }}>{field.name}</strong>
                      <br />
                      {field.crop && <span style={{ color: "#666", fontSize: "13px" }}>🌱 {field.crop}</span>}
                      {field.area_acres && (
                        <><br /><span style={{ color: "#888", fontSize: "12px" }}>📐 {field.area_acres} acres</span></>
                      )}
                      <br />
                      <span style={{ color: "#aaa", fontSize: "11px" }}>
                        {field.latitude.toFixed(5)}, {field.longitude.toFixed(5)}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}