import uuid

from django.db import models


# Create your models here.


class DatasetModel(models.Model):
    dataset_title = models.CharField(default='', max_length=100)
    group_file_id = models.UUIDField(default=uuid.uuid4, editable=False)
    loss = models.FloatField(default=0.0)
    accuracy = models.FloatField(default=0.0)

    class Meta:
        db_table = 'dataset'


class FileHandlerModel(models.Model):
    # file_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # file = models.FileField(upload_to='packets/')
    dataset = models.ForeignKey(DatasetModel, on_delete=models.CASCADE, null=True)
    group_file_id = models.UUIDField(default=uuid.uuid4, editable=False)
    file_name = models.CharField(max_length=50, default='')
    file_data = models.JSONField(null=True, default=list)
    uploaded_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name

    class Meta:
        db_table = 'file_handler'
    # def delete(self, *args, **kwargs):
    #     self.



