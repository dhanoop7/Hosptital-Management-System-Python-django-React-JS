from django.shortcuts import render
from .models import Department, Patient, Appointment
from .serializers import DepartmentSerializer, PatientSerializer, AppointmentSerializer, AppointmentSerializerPatient
from .utils import send_patient_email
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class DepartmentAddView(APIView):
    def get(self, request):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SingleDepartmentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, department_id):
        department = get_object_or_404(Department, id=department_id)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PatientRegistrationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)

        if serializer.is_valid():
            patient = serializer.save()

            send_patient_email(patient.email, patient)
            return Response({'patient_id': patient.patient_id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AppointmentView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
           
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



        


class PatientSearchView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(patient_id=patient_id)
            appointments = Appointment.objects.filter(patient_id=patient_id, viewed=True)
            
            patient_serializer = PatientSerializer(patient)
            appointments_serializer = AppointmentSerializerPatient(appointments, many=True)
            
            response_data = {
                'patient': patient_serializer.data,
                'appointments': appointments_serializer.data,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        
