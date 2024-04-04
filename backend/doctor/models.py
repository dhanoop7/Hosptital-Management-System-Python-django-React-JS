from django.db import models
from authentication.models import CustomUser
from reception.models import Appointment, Department
from django.utils import timezone



# Create your models here.

class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    profile_photo = models.ImageField(upload_to='doctor_profiles/', blank=True, null=True)
    name = models.CharField(max_length=100)


class Prescription(models.Model):
    patient_id = models.IntegerField()  
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    medicine_name = models.CharField(max_length=100)
    consumption_time = models.DateField(auto_now_add=True)
    added_at = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    frequency = models.CharField(max_length=20, choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')])
    dosage_amount = models.FloatField()
    dosage_unit = models.CharField(max_length=20, choices=[('mg', 'Milligrams'), ('ml', 'Milliliters'), ('units', 'Units')])
    viewed = models.BooleanField(default=False)

    added_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='added_prescriptions')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True)

   
    


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)