import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Divider, Chip, Grid, CircularProgress } from "@mui/material";
import Map from "../components/maps/Map";
import apiClient from "../utils/apiClient";

const MapView = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Trip ID from URL:", tripId); // Debugging

  useEffect(() => {
    if (!tripId) {
      setError("Trip ID is missing.");
      setLoading(false);
      return;
    }
    const fetchTrip = async () => {
      try {
        const response = await apiClient.get(`/trips/${tripId}/`);
        setTrip(response.data);
      } catch (err) {
        console.error("Error fetching trip data:", err);
        setError(err.response?.data?.message || "Failed to fetch trip data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;
  if (!trip) return <Typography variant="h6">No trip data found.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trip Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Map
              route={{
                waypoints: [
                  { location: trip.trip.current_location, label: "Start Location" },
                  { location: trip.trip.pickup_location, label: "Pickup Location" },
                  { location: trip.trip.dropoff_location, label: "Dropoff Location" },
                ],
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              HOS Timeline
            </Typography>

            {trip.hos_data?.events.map((event, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip
                    label={event.status}
                    color={
                      event.status === "D"
                        ? "primary"
                        : event.status === "OFF"
                        ? "success"
                        : "default"
                    }
                    sx={{ mr: 2 }}
                  />
                  <Typography>
                    {new Date(event.time).toLocaleTimeString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MapView;