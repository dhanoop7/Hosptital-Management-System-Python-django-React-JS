from rest_framework import serializers
from .models import Department, Patient, Appointment
from authentication.serializer import CustomUserSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id','patient_id', 'name', 'address', 'mobile_number', 'email', 'age', 'gender']
        read_only_fields = ['id', 'patient_id']


class AppointmentSerializer(serializers.ModelSerializer):
    # doctor = CustomUserSerializer()  # Assuming you have a CustomUserSerializer
    # department = DepartmentSerializer()
    class Meta:
        model = Appointment
        fields = '__all__'

class AppointmentSerializerPatient(serializers.ModelSerializer):
    doctor = CustomUserSerializer()  # Assuming you have a CustomUserSerializer
    department = DepartmentSerializer()
    class Meta:
        model = Appointment
        fields = '__all__'


