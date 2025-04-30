import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import MapView from "./pages/MapView"; // Import the MapView page

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={3000}
    >
      <Router>
        <Routes>
          {/* DashboardLayout applied only once */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} /> {/* Default route */}
            <Route path="trips" element={<Trips />} /> {/* Trips page */}
            <Route path="map/:tripId" element={<MapView />} /> {/* MapView page */}
          </Route>
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;