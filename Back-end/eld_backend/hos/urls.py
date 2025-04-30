from django.urls import path
from .views import TripCreateView, TripDetailView

urlpatterns = [
    path('trips/', TripCreateView.as_view(), name='trip-create'),  # Endpoint for creating a trip
    path('trips/<int:id>/', TripDetailView.as_view(), name='trip-detail'),  # Endpoint for retrieving a trip by ID
]