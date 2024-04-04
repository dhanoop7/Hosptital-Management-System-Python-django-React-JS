from django.db import models
from django.utils.crypto import get_random_string
from random import randint, choice
import string
from django.core.validators import MinLengthValidator, MaxLengthValidator




# Create your models here.
class Department(models.Model):
    department = models.CharField(max_length=20)  




class Patient(models.Model):

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    address = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=10, unique=True, validators=[MinLengthValidator(10), MaxLengthValidator(10)])
    email = models.EmailField(unique=True)
    patient_id = models.IntegerField(unique=True, null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)



    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  
        if not self.patient_id:
            self.patient_id = self.generate_patient_id()
            self.save()
    
    def generate_patient_id(self):
        random_string = get_random_string(length=2, allowed_chars='0123456789')
        return int(f"{self.id}{random_string}")
    

class Appointment(models.Model):
    patient_id = models.IntegerField()
    doctor = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='appointments')
    scheduled_time = models.DateTimeField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    token_number = models.CharField(max_length=20, blank=True, null=True)
    viewed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Generate auto Token number before saving the appointment
        if not self.token_number:
            self.token_number = self.generate_auto_token()
        super().save(*args, **kwargs)

    def generate_auto_token(self):
        # Generate a random 2-digit number as the token
        random_char = choice(string.ascii_uppercase)
        random_digits = ''.join([str(randint(0, 9)) for _ in range(2)])
        return f"{random_digits}{random_char}"
    


    











