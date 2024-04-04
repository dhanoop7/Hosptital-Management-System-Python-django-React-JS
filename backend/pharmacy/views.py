from django.shortcuts import render
from doctor.models import Prescription
from doctor.serializers import PrescriptionSerializer, PrescriptionSerializerSingle

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RecentlySubmittedPrescriptionsView(APIView):
    def get(self, request):
        prescriptions = Prescription.objects.filter(viewed=False).order_by('-added_at')[:10]

        prescription_data = []

        for prescription in prescriptions:
            patient = prescription.appointment.patient_id
            added_by_username = f"{prescription.added_by.first_name} {prescription.added_by.last_name}"
            department_name = prescription.department.department

            prescription_data.append({
                'prescription_id': prescription.id,
                'patient': patient,
                'added_by_doctor': added_by_username,
                'department_name': department_name,
                'consumption_time': prescription.frequency,
                "dosage_amount": prescription.dosage_amount,
                "dosage_unit": prescription.dosage_unit,
                'medicine_name': prescription.medicine_name,
                'submission_time': prescription.added_at,
                
            })

        return Response(prescription_data)
    
class MarkPrescriptionAsViewedView(APIView):
    def post(self, request, prescription_id):
        try:
            prescription = Prescription.objects.get(id=prescription_id)
            prescription.viewed = True
            prescription.save()
            return Response({'message': 'Prescription marked as viewed'}, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            return Response({'error': 'Prescription not found'}, status=status.HTTP_404_NOT_FOUND)
    

    
class SinglePatientPrescriptionsView(APIView):
    def get(self, request, patient_id):
        prescriptions = Prescription.objects.filter(appointment__patient_id=patient_id)

        prescription_data = []

        for prescription in prescriptions:
            added_by_username = f"{prescription.added_by.first_name} {prescription.added_by.last_name}"
            department_name = prescription.department.department

            prescription_data.append({
                'patient_id': prescription.appointment.patient_id,
                'added_by_doctor': added_by_username,
                'department_name': department_name,
                'consumption_time': prescription.frequency,
                "dosage_amount": prescription.dosage_amount,
                "dosage_unit": prescription.dosage_unit,
                'medicine_name': prescription.medicine_name,
                'submission_time': prescription.added_at,
            })

        return Response(prescription_data)


class SinglePrescriptionView(APIView):
    def get(self, request, prescription_id):
        try:
            prescription = Prescription.objects.get(id=prescription_id)
            serializer = PrescriptionSerializerSingle(prescription)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            return Response({'error': 'Prescription not found'}, status=status.HTTP_404_NOT_FOUND)



class PatientPrescriptionView(APIView):
    def get(self, request, patient_id):
        try:
            prescriptions = Prescription.objects.filter(patient_id=patient_id)
            serializer = PrescriptionSerializer(prescriptions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            return Response({"detail": "Prescriptions not found for the given patient ID."}, status=status.HTTP_404_NOT_FOUND)
        

class AllPrescriptionHistoriesView(APIView):
    def get(self, request):
        try:
            prescriptions = Prescription.objects.all()
            serializer = PrescriptionSerializer(prescriptions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            return Response({"detail": "Prescriptions not found."}, status=status.HTTP_404_NOT_FOUND)
