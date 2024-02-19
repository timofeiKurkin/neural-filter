from rest_framework import serializers
from .models import FileHandler


class FileHandlerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileHandler
        fields = ('file', 'uploaded_on')
