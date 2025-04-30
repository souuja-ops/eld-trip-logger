from django.db import models

class Trip(models.Model):
    date = models.DateField()
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField()

    # New fields
    route_data = models.JSONField(null=True, blank=True)  # To store route calculation data
    hos_data = models.JSONField(null=True, blank=True)    # To store HOS compliance data
    calculation_errors = models.TextField(blank=True)     # To store any errors during calculations

    def __str__(self):
        return f"Trip on {self.date} from {self.pickup_location} to {self.dropoff_location}"

    class Meta:
        ordering = ['-date']