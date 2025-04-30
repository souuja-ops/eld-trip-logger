import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Button, CircularProgress, Card, CardContent, Typography,
  Grid, InputAdornment, TextField, Divider
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import apiClient from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';

// Configure Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic291dWphIiwiYSI6ImNtOG5pb3VoODAxMXYydnM3YmJqcHl1cHcifQ.Hj4mDdEGaHpxj2I75QGWVg';

export default function TripForm() {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Refs for geocoder containers
  const currentLocationRef = useRef(null);
  const pickupLocationRef = useRef(null);
  const dropoffLocationRef = useRef(null);

  // State to store coordinates
  const [coordinates, setCoordinates] = useState({
    currentLocation: null,
    pickupLocation: null,
    dropoffLocation: null,
  });

  // Initialize Mapbox Geocoder
  const initializeGeocoder = (containerRef, setFieldValue, locationKey) => {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Search location...',
      mapboxgl: mapboxgl,
    });

    geocoder.on('result', (e) => {
      const { place_name, geometry } = e.result;
      setFieldValue(place_name); // Set the address in the form
      setCoordinates((prev) => ({
        ...prev,
        [locationKey]: geometry.coordinates, // Store the coordinates
      }));
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear any existing content
      geocoder.addTo(containerRef.current);
    }
  };

  // Attach geocoders to input fields
  useEffect(() => {
    initializeGeocoder(currentLocationRef, (value) => setValue('currentLocation', value), 'currentLocation');
    initializeGeocoder(pickupLocationRef, (value) => setValue('pickupLocation', value), 'pickupLocation');
    initializeGeocoder(dropoffLocationRef, (value) => setValue('dropoffLocation', value), 'dropoffLocation');
  }, [setValue]);

  const onSubmit = async (data) => {
    if (!coordinates.currentLocation || !coordinates.pickupLocation || !coordinates.dropoffLocation) {
      enqueueSnackbar("Please select valid locations for all fields.", { variant: "error" });
      return;
    }
  
    setIsSubmitting(true);
    try {
      const formattedData = {
        date: data.date.toISOString().split('T')[0],
        current_location: coordinates.currentLocation.join(','), // Convert to "latitude,longitude"
        pickup_location: coordinates.pickupLocation.join(','), // Convert to "latitude,longitude"
        dropoff_location: coordinates.dropoffLocation.join(','), // Convert to "latitude,longitude"
        current_cycle_used: parseFloat(data.currentCycleUsed),
      };
  
      console.log("Submitting data:", formattedData); // Debugging
  
      const response = await apiClient.post('/trips/', formattedData);
  
      console.log("Trip created successfully. Trip ID:", response.data.id); // Debugging
  
      enqueueSnackbar('Trip saved successfully!', { variant: 'success' });
      navigate(`/map/${response.data.id}`); // Redirect to MapView with tripId
    } catch (error) {
      console.error("Error response:", error.response?.data);
      enqueueSnackbar(error.response?.data?.message || 'Submission failed', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card 
      elevation={4} 
      sx={{ 
        maxWidth: 800, 
        margin: 'auto', 
        mt: 4, 
        borderRadius: 4, 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
          Log Your Trip
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Date Field */}
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                defaultValue={new Date()}
                rules={{ required: "Trip date is required" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    customInput={
                      <TextField
                        fullWidth
                        label="Trip Date"
                        error={!!errors.date}
                        helperText={errors.date?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ScheduleIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    }
                  />
                )}
              />
            </Grid>

            {/* Current Location */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Current Location
              </Typography>
              <Box
                ref={currentLocationRef}
                sx={{
                  position: 'relative',
                  zIndex: 10,
                  '& .mapboxgl-ctrl-geocoder': {
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 1,
                  },
                }}
              />
            </Grid>

            {/* Pickup Location */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Pickup Location
              </Typography>
              <Box
                ref={pickupLocationRef}
                sx={{
                  position: 'relative',
                  zIndex: 10,
                  '& .mapboxgl-ctrl-geocoder': {
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 1,
                  },
                }}
              />
            </Grid>

            {/* Dropoff Location */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Dropoff Location
              </Typography>
              <Box
                ref={dropoffLocationRef}
                sx={{
                  position: 'relative',
                  zIndex: 10,
                  '& .mapboxgl-ctrl-geocoder': {
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 1,
                  },
                }}
              />
            </Grid>

            {/* Cycle Hours */}
            <Grid item xs={12} md={6}>
              <Controller
                name="currentCycleUsed"
                control={control}
                defaultValue={0}
                rules={{
                  required: "Required field",
                  min: { value: 0, message: "Must be positive" },
                  max: { value: 70, message: "Exceeds 70-hour limit" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Cycle Hours Used"
                    type="number"
                    error={!!errors.currentCycleUsed}
                    helperText={errors.currentCycleUsed?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">hours</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Log Trip'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}