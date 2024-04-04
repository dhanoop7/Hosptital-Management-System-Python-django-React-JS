from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_reception', 'is_doctor', 'is_pharmacy', 'department', 'first_name', 'last_name', 'mobile_number']


    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField()
    current_password = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value




