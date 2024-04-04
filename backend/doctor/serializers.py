from rest_framework import serializers
from .models import DoctorProfile
from .models import Prescription
from reception.serializers import DepartmentSerializer
from authentication.serializer import CustomUserSerializer

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = [ 'name', 'profile_photo']

class ReassignPatientSerializer(serializers.Serializer):
    new_doctor_id = serializers.IntegerField()
    new_department_id = serializers.IntegerField()

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class PrescriptionSerializerSingle(serializers.ModelSerializer):
    added_by = CustomUserSerializer()
    department = DepartmentSerializer()

    class Meta:
        model = Prescription
        fields = '__all__'