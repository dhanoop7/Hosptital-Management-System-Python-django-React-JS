from django.urls import path
from .views import UserRegisterView, UserLoginView, PasswordResetView, DoctorsByDepartmentView, SingleUserview

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('singleuser/<int:user_id>/', SingleUserview.as_view(), name='singleuser'),
    path('resetpassword/', PasswordResetView.as_view(), name='resetpassword'),
    path('department_doctors/<int:department_id>/', DoctorsByDepartmentView.as_view(), name='doctors_department'),
]
