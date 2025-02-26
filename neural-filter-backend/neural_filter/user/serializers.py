from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password

from django.utils.translation import gettext_lazy as _


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=20, write_only=True, required=True)
    new_password = serializers.CharField(max_length=20, write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        print(f"{user=}, {value=}")
        print(f"{user.check_password(value)=}")
        if not user.check_password(value):
            raise serializers.ValidationError(_("Wrong password"))
        return value

    def validate(self, data: dict):
        validate_password(data['new_password'], self.context['request'].user)
        return data

    def save(self, **kwargs):
        password = self.validated_data['new_password']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user

