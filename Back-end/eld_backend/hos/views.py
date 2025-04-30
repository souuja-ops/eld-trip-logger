from rest_framework import generics, status
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer
from .services import RouteCalculationService, HOSCalculationService


class TripCreateView(generics.CreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def perform_create(self, serializer):
        trip = serializer.save()

        try:
            # Get route data
            route_data, route_error = RouteCalculationService.route_calculation_service(
                origin=trip.current_location,
                pickup_location=trip.pickup_location,
                dropoff_location=trip.dropoff_location
            )

            if route_error:
                raise ValueError(f"Route calculation failed: {route_error}")

            # Save route data
            trip.route_data = route_data

            # Get HOS data
            hos_data, hos_error = HOSCalculationService.hos_calculation_service(trip)

            if hos_error:
                raise ValueError(f"HOS calculation failed: {hos_error}")

            # Save HOS data
            trip.hos_data = hos_data
            trip.save()

        except Exception as e:
            trip.calculation_errors = str(e)
            trip.save()
            raise ValueError(f"Calculation error: {e}")
        return trip

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            trip_id = response.data.get('id')  # Ensure the ID is included in the response
            return Response(
                {
                    'status': 'success',
                    'data': response.data,
                    'message': 'Trip created successfully',
                    'trip_id': trip_id  # Include trip_id explicitly
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {
                    'status': 'error',
                    'message': str(e),
                    'details': 'Check calculation_errors field in trip data'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

class TripDetailView(generics.RetrieveAPIView):
    """
    API endpoint that retrieves a specific Trip by ID.
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {
                'status': 'success',
                'data': serializer.data,
                'message': 'Trip retrieved successfully'
            },
            status=status.HTTP_200_OK
        )