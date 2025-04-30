import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const MAPBOX_API_KEY = "pk.eyJ1Ijoic291dWphIiwiYSI6ImNtOG5pb3VoODAxMXYydnM3YmJqcHl1cHcifQ.Hj4mDdEGaHpxj2I75QGWVg";

const currentIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"), // Default blue
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41]
});

const pickupIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-green.png", // Green icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/markers/marker-shadow.png",
  shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-red.png", // Red icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/markers/marker-shadow.png",
  shadowSize: [41, 41]
});

function App() {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    driver_name: "",
    date: "",
    total_miles: "",
    off_duty_hours: "",
    sleeper_berth_hours: "",
    driving_hours: "",
    on_duty_hours: "",
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_hours: ""
  });

  // 📌 References for Mapbox autocomplete fields
  const currentLocationRef = useRef(null);
  const pickupLocationRef = useRef(null);
  const dropoffLocationRef = useRef(null);

  useEffect(() => {
    fetchLogs();

    // 📌 Attach Mapbox autocomplete to location inputs
    setupGeocoder(currentLocationRef, "current_location");
    setupGeocoder(pickupLocationRef, "pickup_location");
    setupGeocoder(dropoffLocationRef, "dropoff_location");
  }, []);

  const fetchLogs = () => {
    axios.get("http://127.0.0.1:8000/api/logs/")
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.error("Error fetching logs:", error);
      });
  };

  // 📌 Function to enable Mapbox autocomplete
  const setupGeocoder = (inputRef, fieldName) => {
    if (!inputRef.current || inputRef.current.hasGeocoder) return; // ✅ Prevent multiple attachments
  
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_API_KEY,
      types: "place",
      placeholder: "Search for a location...",
      mapboxgl: mapboxgl
    });
  
    geocoder.addTo(inputRef.current);
    inputRef.current.hasGeocoder = true; // ✅ Mark as attached to avoid duplicates
  
    geocoder.on("result", (e) => {
      const { center } = e.result;
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: `${center[1]},${center[0]}` //Save as lat,lng format
      }));
    });
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Ensure all fields are filled before sending request
    for (let key in formData) {
      if (formData[key] === "") {
        alert(`Please fill out the ${key.replace("_", " ")} field.`);
        return;
      }
    }
  
    axios.post("http://127.0.0.1:8000/api/logs/", formData)
      .then(response => {
        setLogs([...logs, response.data]); // Update logs list
  
        // ✅ Reset form fields
        setFormData({
          driver_name: "",
          date: "",
          total_miles: "",
          off_duty_hours: "",
          sleeper_berth_hours: "",
          driving_hours: "",
          on_duty_hours: "",
          current_location: "",
          pickup_location: "",
          dropoff_location: "",
          current_cycle_hours: ""
        });
  
        // ✅ Clear autocomplete fields
        document.querySelector(".mapboxgl-ctrl-geocoder input").value = "";
      })
      .catch(error => {
        console.error("Error adding log:", error);
      });
  };
  

  const parseLocation = (location) => {
    if (!location) return null;
    const coords = location.split(",").map(Number);
    return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) ? coords : null;
  };

  return (
    <div>
      <h1>Driver Logs</h1>

      {/* 📌 Updated Form with Mapbox Autocomplete */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="driver_name" placeholder="Driver Name" value={formData.driver_name} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        {/* 📌 Only Mapbox Autocomplete for Location Inputs */}
        <label>Current Location</label>
        <div ref={currentLocationRef} style={{ width: "100%", marginBottom: "10px" }} />
        
        <label>Pickup Location</label>
        <div ref={pickupLocationRef} style={{ width: "100%", marginBottom: "10px" }} />
        
        <label>Dropoff Location</label>
        <div ref={dropoffLocationRef} style={{ width: "100%", marginBottom: "10px" }} />

        <input type="number" name="total_miles" placeholder="Total Miles" value={formData.total_miles} onChange={handleChange} required />
        <input type="number" name="off_duty_hours" placeholder="Off Duty Hours" value={formData.off_duty_hours} onChange={handleChange} required />
        <input type="number" name="sleeper_berth_hours" placeholder="Sleeper Berth Hours" value={formData.sleeper_berth_hours} onChange={handleChange} required />
        <input type="number" name="driving_hours" placeholder="Driving Hours" value={formData.driving_hours} onChange={handleChange} required />
        <input type="number" name="on_duty_hours" placeholder="On Duty Hours" value={formData.on_duty_hours} onChange={handleChange} required />
        <input type="number" name="current_cycle_hours" placeholder="Current Cycle Used (Hrs)" value={formData.current_cycle_hours} onChange={handleChange} required />
        <button type="submit">Add Log</button>
        <button type="button" onClick={() => setLogs([])}>Clear Map</button>

      </form>

      {/* 📌 Map Display */}
      <MapContainer center={[-1.286389, 36.817223]} zoom={6} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {logs.map((log, index) => {
          const currentLocation = parseLocation(log.current_location);
          const pickupLocation = parseLocation(log.pickup_location);
          const dropoffLocation = parseLocation(log.dropoff_location);

          if (!currentLocation || !pickupLocation || !dropoffLocation) {
            return null;
          }

          return (
            <React.Fragment key={index}>
              <Marker position={currentLocation} icon={currentIcon} />
              <Marker position={pickupLocation} icon={pickupIcon} />
              <Marker position={dropoffLocation} icon={dropoffIcon} />
              <Polyline positions={[currentLocation, pickupLocation, dropoffLocation]} color="blue" />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
