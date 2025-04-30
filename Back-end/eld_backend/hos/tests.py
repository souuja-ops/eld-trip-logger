from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Trip

class TripAPITestCase(APITestCase):
    def setUp(self):
        """
        Set up test data for the API tests.
        """
        self.trip_data = {
            "date": "2025-04-07",
            "current_location": "36.817245,-1.283253",
            "pickup_location": "36.817245,-1.283253",
            "dropoff_location": "36.82772,-1.170537",
            "current_cycle_used": 48.0
        }
        self.trip = Trip.objects.create(
            date="2025-04-06",
            current_location="36.82772,-1.170537",
            pickup_location="36.817245,-1.283253",
            dropoff_location="36.817245,-1.283253",
            current_cycle_used=24.0,
            route_data={"distance": 10000, "duration": 3600},
            hos_data={"driving_time_hours": 1.0, "on_duty_time_hours": 2.0},
            calculation_errors=""
        )

    def test_create_trip_returns_trip_id(self):
        """
        Test that the POST /api/trips/ endpoint returns the trip_id in the response.
        """
        url = reverse('trip-create')  # URL for the TripCreateView
        response = self.client.post(url, self.trip_data, format='json')

        # Check the response status
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that the response contains the trip_id
        self.assertIn('trip_id', response.data)
        self.assertIsNotNone(response.data['trip_id'])

        # Verify that the trip was created in the database
        trip_id = response.data['trip_id']
        self.assertTrue(Trip.objects.filter(id=trip_id).exists())

    def test_retrieve_trip(self):
        """
        Test that the GET /api/trips/<id>/ endpoint retrieves the correct trip details.
        """
        url = reverse('trip-detail', kwargs={'id': self.trip.id})  # URL for the TripDetailView
        response = self.client.get(url)

        # Check the response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the response contains the correct trip data
        self.assertEqual(response.data['data']['id'], self.trip.id)
        self.assertEqual(response.data['data']['current_location'], self.trip.current_location)
        self.assertEqual(response.data['data']['pickup_location'], self.trip.pickup_location)
        self.assertEqual(response.data['data']['dropoff_location'], self.trip.dropoff_location)

    def test_create_trip_with_invalid_data(self):
        """
        Test that the POST /api/trips/ endpoint handles invalid data correctly.
        """
        invalid_data = self.trip_data.copy()
        invalid_data['current_location'] = "invalid_coordinates"  # Invalid coordinates
        url = reverse('trip-create')
        response = self.client.post(url, invalid_data, format='json')

        # Check the response status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check that the response contains an error message
        self.assertIn('message', response.data)
        self.assertIn('details', response.data)