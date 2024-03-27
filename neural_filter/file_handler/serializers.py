from rest_framework import serializers
from .models import FileHandlerModel, DatasetModel


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetModel
        fields = (
            'dataset_title',
            'group_file_id',
            'loss',
            'val_loss',
            'accuracy',
            'val_accuracy',
            'count_files'
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        return DatasetModel.objects.create(**validated_data)


# One model item
class FileHandlerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileHandlerModel
        fields = (
            'file_data',
            'file_name',
            'group_file_id',
            'dataset_id'
        )

    def create(self, validated_data):
        return FileHandlerModel.objects.create(**validated_data)


# Multiple items model
class MultipleSerializer(serializers.Serializer):
    file = serializers.ListField(
        child=serializers.FileField()
    )
    dataset_title = serializers.CharField(max_length=100)
