from django.shortcuts import render
from .models import CustomUser
from .serializer import CustomUserSerializer, UserLoginSerializer, PasswordResetSerializer
from .utils import send_password_email
from django.contrib.auth import authenticate
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta

# Create your views here.
class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)

        if serializer.is_valid():

            is_reception = request.data.get('is_reception', False)
            is_doctor = request.data.get('is_doctor', False)
            is_pharmacy = request.data.get('is_pharmacy', False)

            serializer.validated_data['is_reception'] = is_reception
            serializer.validated_data['is_doctor'] = is_doctor
            serializer.validated_data['is_pharmacy'] = is_pharmacy

            random_password = get_random_string(length=6)

            user = serializer.save(password=random_password, is_active=True)
            refresh = RefreshToken.for_user(user)
            expiration_time = datetime.utcnow() + timedelta(days=1)
            refresh.payload = {
                "user_id": user.id,
                "username": user.username,
                "active": user.is_active,
                "is_reception": user.is_reception,
                "is_doctor": user.is_doctor,
                "is_pharmacy": user.is_pharmacy,
                "exp": expiration_time.timestamp(),
            }

            send_password_email(user.email, random_password)

            return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'message':'sucessfully registered'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SingleUserview(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                expiration_time = datetime.utcnow() + timedelta(days=1)
                
                refresh.payload['is_reception'] = user.is_reception
                refresh.payload['is_doctor'] = user.is_doctor
                refresh.payload['is_pharmacy'] = user.is_pharmacy
                refresh.payload['exp'] = expiration_time.timestamp()
                refresh.payload['first_name'] = user.first_name
                refresh.payload['last_name'] = user.last_name

                return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
           
                
class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            confirm_new_password = serializer.validated_data['confirm_new_password']

            try:
                user = CustomUser.objects.get(username=username)
            except CustomUser.DoesNotExist:
                return Response({'error':'User not found'}, status=status.HTTP_404_NOT_FOUND)


            if new_password != confirm_new_password:
                 return Response({'error': 'New password and confirmation do not match'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not user.check_password(current_password):
                return Response({'error': 'Incorrect current password'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()

            return Response({'detail': 'Password reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorsByDepartmentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, department_id):
        doctors = CustomUser.objects.filter(department_id=department_id, is_doctor=True)
        serializer = CustomUserSerializer(doctors, many=True)
        return Response(serializer.data)


            
            
        
