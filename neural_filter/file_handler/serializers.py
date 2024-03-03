from rest_framework import serializers
from .models import FileHandlerModel, DatasetModel


class DatasetSerializer(serializers.Serializer):
    dataset_title = serializers.CharField(max_length=100)
    group_file_id = serializers.UUIDField()
    loss = serializers.FloatField()
    accuracy = serializers.FloatField()

    class Meta:
        model = DatasetModel


# One model item
class FileHandlerSerializer(serializers.ModelSerializer):
    file_data = serializers.JSONField()
    file_name = serializers.CharField(max_length=50)
    group_file_id = serializers.UUIDField()
    # uploaded_on = serializers.DateTimeField()

    class Meta:
        model = FileHandlerModel
        fields = (
            'file_data',
            'file_name',
            'group_file_id',
            # 'uploaded_on'
        )

    def create(self, validated_data):
        return FileHandlerModel.objects.create(**validated_data)

    # Continue to make saving file in db with serializer


# Multiple items model
class MultipleSerializer(serializers.Serializer):
    file = serializers.ListField(
        child=serializers.FileField()
    )
    dataset_title = serializers.CharField(max_length=100)

    def create(self, validated_data):
        return FileHandlerModel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.file_data = validated_data.get('file_data', instance.file_data)
        instance.file_name = validated_data.get('file_name', instance.file_name)
        instance.group_file_id = validated_data.get('group_file_id', instance)
        instance.save()
        return instance
