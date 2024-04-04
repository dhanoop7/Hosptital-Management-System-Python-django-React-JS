from django.urls import path
from .views import DepartmentAddView, PatientRegistrationView, AppointmentView, PatientSearchView, SingleDepartmentView


urlpatterns = [
    path('department/', DepartmentAddView.as_view(), name='department'),
    path('patient/', PatientRegistrationView.as_view(), name='patient'),
    path('appointment/', AppointmentView.as_view(), name='apointment'),
    path('patientsearch/<int:patient_id>/', PatientSearchView.as_view(), name='patient_search'),
    path('departments/<int:department_id>/', SingleDepartmentView.as_view(), name='single_department'),
]
