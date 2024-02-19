from rest_framework import serializers
from .models import FileHandlerModel


class FileHandlerSerializer(serializers.ModelSerializer):
    files = serializers.ListSerializer(
        child=serializers.FileField(allow_empty_file=False)
    )

    class Meta:
        model = FileHandlerModel
        fields = ('files',)

