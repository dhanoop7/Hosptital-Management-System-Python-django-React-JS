from django.db import models
from django.contrib.auth.models import AbstractUser
from reception.models import Department
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator, MaxLengthValidator
# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_reception = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_pharmacy = models.BooleanField(default=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    mobile_number = models.CharField(unique=True, max_length=10, null= True, blank = True,  validators=[MinLengthValidator(10),MaxLengthValidator(10)])


    def clean(self):
        super().clean()
        if self.mobile_number:
            if len(str(self.mobile_number)) != 10:
                raise ValidationError(
                    _('Mobile number must be exactly 10 digits.'),
                    code='invalid_mobile_number'
                )
    def full_clean(self, *args, **kwargs):
        self.clean()
        super().full_clean(*args, **kwargs)





