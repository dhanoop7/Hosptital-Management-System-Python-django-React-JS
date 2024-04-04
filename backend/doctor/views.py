from django.shortcuts import render
from .models import DoctorProfile
from reception.models import Appointment, Patient
from reception.serializers import AppointmentSerializer, PatientSerializer
from .models import Prescription
from .serializers import DoctorProfileSerializer, PrescriptionSerializer, ReassignPatientSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, parsers
from rest_framework.permissions import AllowAny, IsAuthenticated


# Create your views here.
class DoctorProfileView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [parsers.MultiPartParser]


    def get(self, request):
        doctors = DoctorProfile.objects.all()
        serializer = DoctorProfileSerializer(doctors, many=True)
        return Response(serializer.data)

    def post(self, request):

        data ={**request.data, 'user':request.user.id}

        serializer = DoctorProfileSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctor_id = request.user.id
        appointments = Appointment.objects.filter(doctor_id=doctor_id, viewed=False).order_by('-scheduled_time')
        serializer = AppointmentSerializer(appointments, many=True)

        return Response(serializer.data)


class SingleAppointmentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    

class SearchPatientByID(APIView):
    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(patient_id=patient_id)
            serializer = PatientSerializer(patient)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

class ConsultationView(APIView):
    def get_patient_by_id(self, patient_id):
        try:
            return Patient.objects.get(patient_id=patient_id)
        except Patient.DoesNotExist:
            return None

    def get(self, request, patient_id):
        patient = self.get_patient_by_id(patient_id)

        if patient:
            serializer = PatientSerializer(patient)
            return Response(serializer.data)
        else:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        
class MarkAsViewedView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            appointment.viewed = True
            appointment.save()

            return Response({'message': 'Appointment marked as viewed'}, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
        

class ReassignPatientView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReassignPatientSerializer(data=request.data)
        if serializer.is_valid():
            new_doctor_id = serializer.validated_data['new_doctor_id']
            new_department_id = serializer.validated_data['new_department_id']

            appointment.doctor_id = new_doctor_id
            appointment.department_id = new_department_id
            appointment.save()

            updated_appointment_serializer = AppointmentSerializer(appointment)
            return Response(updated_appointment_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PrescriptionAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        request.data['added_by'] = user.id

        department = user.department
        request.data['department'] = department.id

        serializer = PrescriptionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(added_by=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PatientHistoryView(APIView):
    def get(self, request, patient_id):

        patient = Patient.objects.filter(patient_id=patient_id)
        patient_serializer = PatientSerializer(patient, many=True)

        prescriptions = Prescription.objects.filter(patient_id=patient_id)
        prescription_serializer = PrescriptionSerializer(prescriptions, many=True)

        appointments = Appointment.objects.filter(patient_id=patient_id, viewed=True)
        appointment_serializer = AppointmentSerializer(appointments, many=True)

        patient_history = {
            'patient': patient_serializer.data,
            'prescriptions': prescription_serializer.data,
            'consultation_history': appointment_serializer.data,
        }


        return Response(patient_history, status=status.HTTP_200_OK)
    




    
