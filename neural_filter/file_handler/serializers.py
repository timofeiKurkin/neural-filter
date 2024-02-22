from rest_framework import serializers
from .models import FileHandlerModel


class FileHandlerSerializer(serializers.ModelSerializer):
    # file = serializers.FileField()

    class Meta:
        model = FileHandlerModel
        fields = ('file', 'uploaded_on')


class MultipleSerializer(serializers.Serializer):
    file = serializers.ListField(
        child=serializers.FileField()
    )

    def create(self, validated_data):
        return FileHandlerModel.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     instance.file = validated_data.get('file', instance.file)
    #     instance.save()
    #     return instance
