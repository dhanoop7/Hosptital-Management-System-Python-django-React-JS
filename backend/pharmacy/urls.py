from django.urls import path
from .views import RecentlySubmittedPrescriptionsView, PatientPrescriptionView, AllPrescriptionHistoriesView, SinglePatientPrescriptionsView, SinglePrescriptionView, MarkPrescriptionAsViewedView


urlpatterns = [
    path('recent_prescriptions/', RecentlySubmittedPrescriptionsView.as_view(), name='recent_prescriptions'),
    path('patient_prescriptions/<int:patient_id>/', PatientPrescriptionView.as_view(), name='patient-prescriptions'),
    path('single_patient_prescriptions/<int:patient_id>/', SinglePatientPrescriptionsView.as_view(), name='single_patient_prescriptions'),
    path('all_prescription_histories/', AllPrescriptionHistoriesView.as_view(), name='all-prescription-histories'),
    path('prescriptions/<int:prescription_id>/', SinglePrescriptionView.as_view(), name='single-prescription'),
    path('markprescription/<int:prescription_id>/', MarkPrescriptionAsViewedView.as_view(), name='mark_prescription_as_viewed'),
]

