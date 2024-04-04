from django.urls import path
from .views import DoctorProfileView, DoctorAppointmentsView, ConsultationView, PrescriptionAddView, PatientHistoryView, ReassignPatientView, SearchPatientByID, SingleAppointmentView, MarkAsViewedView

urlpatterns = [
    path('profile/', DoctorProfileView.as_view(), name='profile'),
    path('doctorappointments/', DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    path('consultations/<int:patient_id>/', ConsultationView.as_view(), name='consultation-history'),
    path('search-patient/<int:patient_id>/', SearchPatientByID.as_view(), name='search_patient_by_id'),
    path('reassign/<int:appointment_id>/', ReassignPatientView.as_view(), name='reassign-patient'),
    path('single_appointment/<int:appointment_id>/', SingleAppointmentView.as_view(), name='single_appointment'),
    path('prescriptionsadd/', PrescriptionAddView.as_view(), name='add_prescription'),
    path('patienthistory/<int:patient_id>/', PatientHistoryView.as_view(), name='patient-history'),
    path('markappointments/<int:appointment_id>/', MarkAsViewedView.as_view(), name='mark_as_viewed'),
]
