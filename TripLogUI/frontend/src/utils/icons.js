import L from "leaflet";

export const currentIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41]
});

export const pickupIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/markers/marker-shadow.png",
  shadowSize: [41, 41]
});

export const dropoffIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/markers/marker-shadow.png",
  shadowSize: [41, 41]
});
