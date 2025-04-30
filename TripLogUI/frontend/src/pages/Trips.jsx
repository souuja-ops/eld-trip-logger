import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import TripForm from "../components/trips/TripForm";
import Map from "../components/maps/Map"; // Import the Map component

export default function Trips() {
  const [tripData, setTripData] = useState(null); // State to store trip data from the backend

  const handleSuccess = (data) => {
    // Transform backend response into route data
    const transformedRoute = {
      waypoints: [
        { location: data.trip.start_location.split(",").map(Number), label: "Start Location" },
        { location: data.trip.pickup_location.split(",").map(Number), label: "Pickup Location" },
        { location: data.trip.end_location.split(",").map(Number), label: "Dropoff Location" },
      ],
    };
    setTripData({ ...data, route: transformedRoute });
    console.log("Trip logged successfully!", data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Trip Logs
        </Typography>

        {/* Trip Form */}
        <TripForm onSuccess={handleSuccess} />

        {/* Map View */}
        {tripData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Route Map
            </Typography>
            <Map route={tripData.route} />
          </Box>
        )}
      </Box>
    </Container>
  );
}