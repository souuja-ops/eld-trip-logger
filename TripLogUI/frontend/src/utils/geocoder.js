import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const MAPBOX_API_KEY = "pk.eyJ1Ijoic291dWphIiwiYSI6ImNtOG5pb3VoODAxMXYydnM3YmJqcHl1cHcifQ.Hj4mDdEGaHpxj2I75QGWVg";

export const setupGeocoder = (inputRef, fieldName, setFormData) => {
  if (!inputRef.current || inputRef.current.hasGeocoder) return;

  const geocoder = new MapboxGeocoder({
    accessToken: MAPBOX_API_KEY,
    types: "place",
    placeholder: "Search for a location...",
    mapboxgl: mapboxgl
  });

  geocoder.addTo(inputRef.current);
  inputRef.current.hasGeocoder = true;

  geocoder.on("result", (e) => {
    const { center } = e.result;
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: `${center[1]},${center[0]}`
    }));
  });
};
