from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id',
            'date',
            'current_location',
            'pickup_location',
            'dropoff_location',
            'current_cycle_used',
            'route_data',
            'hos_data',
            'calculation_errors'
        ]
        read_only_fields = ['id', 'route_data', 'hos_data', 'calculation_errors']

    def validate(self, data):
        # Validate coordinates for current_location, pickup_location, and dropoff_location
        for field in ['current_location', 'pickup_location', 'dropoff_location']:
            if ',' in data[field]:  # Assuming coordinates are provided as "latitude,longitude"
                try:
                    lat, lon = map(float, data[field].split(','))
                    if not (-90 <= lat <= 90):
                        raise serializers.ValidationError(f"Invalid latitude in {field}: {lat}")
                    if not (-180 <= lon <= 180):
                        raise serializers.ValidationError(f"Invalid longitude in {field}: {lon}")
                except ValueError:
                    raise serializers.ValidationError(f"Invalid coordinate format in {field}: {data[field]}")
            else:
                raise serializers.ValidationError(f"{field} must be in the format 'latitude,longitude'")
        return data