import requests
from django.conf import settings
from typing import Dict, Tuple, Optional
from .models import Trip

class RouteCalculationService:
    """
    Service for calculating routes using Mapbox API
    """

    @staticmethod
    def route_calculation_service(
        origin: str,
        pickup_location: str,
        dropoff_location: str,
        profile: str = 'driving'
    ) -> Tuple[Optional[Dict], Optional[str]]:
        """
        Calculate route between locations using Mapbox Directions API

        Args:
            origin: Starting location (latitude,longitude)
            pickup_location: Intermediate pickup location (latitude,longitude)
            dropoff_location: Final destination (latitude,longitude)
            profile: Routing profile (driving, walking, cycling)

        Returns:
            Tuple containing (route_data, error_message)
        """
        # Get Mapbox access token from settings
        access_token = getattr(settings, 'MAPBOX_ACCESS_TOKEN', None)
        if not access_token:
            return None, "Mapbox access token not configured"

        # Construct coordinates string for API request
        coordinates = f"{origin};{pickup_location};{dropoff_location}"

        # Mapbox API endpoint
        url = f"https://api.mapbox.com/directions/v5/mapbox/{profile}/{coordinates}"

        try:
            # Make API request
            response = requests.get(url, params={
                'access_token': access_token,
                'geometries': 'geojson',
                'steps': 'true',
                'overview': 'full',
                'annotations': 'distance,duration'
            })

            # Check for successful response
            if response.status_code != 200:
                return None, f"Mapbox API error: {response.json().get('message', 'Unknown error')}"

            data = response.json()

            # Extract relevant route information
            if not data.get('routes'):
                return None, "No routes found for given locations"

            route = data['routes'][0]

            # Ensure 'distance' exists in the route data
            if 'distance' not in route:
                return None, "Missing 'distance' in route data"

            # Format the response
            result = {
                'distance': route['distance'],  # in meters
                'duration': route['duration'],  # in seconds
                'geometry': route['geometry'],
                'steps': [
                    {
                        'instruction': step['maneuver']['instruction'],
                        'distance': step['distance'],
                        'duration': step['duration'],
                        'type': step['maneuver']['type']
                    }
                    for step in route['legs'][0]['steps']
                ],
                'waypoints': [
                    {
                        'name': wp.get('name', ''),
                        'location': wp['location']
                    }
                    for wp in data['waypoints']
                ]
            }

            return result, None

        except requests.exceptions.RequestException as e:
            return None, f"API request failed: {str(e)}"
        except (KeyError, IndexError) as e:
            return None, f"Error processing API response: {str(e)}"


class HOSCalculationService:
    """
    Service for calculating Hours of Service (HOS) compliance data
    """

    @staticmethod
    def hos_calculation_service(trip: Trip) -> Tuple[Optional[Dict], Optional[str]]:
        """
        Calculate HOS compliance data for a trip

        Args:
            trip: Trip model instance

        Returns:
            Tuple containing (hos_data, error_message)
        """
        try:
            # Ensure route_data is available
            if not trip.route_data:
                return None, "Missing route data"

            # Use pre-calculated route data
            route_data = trip.route_data

            # Ensure 'distance' exists in route_data
            if 'distance' not in route_data:
                return None, "Missing 'distance' in route data"

            # Convert seconds to hours for driving time
            driving_time_hours = route_data['duration'] / 3600
            distance_miles = route_data['distance'] / 1609.34  # Convert meters to miles

            # Calculate on-duty time (driving + 1 hour for pickup/dropoff)
            on_duty_time_hours = driving_time_hours + 1.0

            # Prepare ELD-compliant data
            hos_data = {
                'driving_time_hours': round(driving_time_hours, 2),
                'on_duty_time_hours': round(on_duty_time_hours, 2),
                'distance_miles': round(distance_miles, 2),
                'hos_compliance': {
                    '11_hour_rule': on_duty_time_hours <= 11,
                    '14_hour_rule': on_duty_time_hours <= 14
                }
            }

            return hos_data, None

        except Exception as e:
            return None, f"HOS calculation error: {str(e)}"