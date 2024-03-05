import uuid

from django.db import models


# Create your models here.


class DatasetModel(models.Model):
    dataset_title = models.CharField(max_length=50)

    group_file_id = models.UUIDField(default=uuid.uuid4)

    count_files = models.IntegerField(default=0)

    loss = models.FloatField(default=0.0)

    accuracy = models.FloatField(default=0.0)

    def __str__(self):
        return (f"dataset_title: {self.dataset_title}, "
                f"group_file_id: {self.group_file_id}, "
                f"loss: {self.loss}, "
                f"accuracy: {self.accuracy}")

    class Meta:
        db_table = 'dataset'


class FileHandlerModel(models.Model):
    # file_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # file = models.FileField(upload_to='packets/')

    # Data from pcap files that transferred to json format
    file_data = models.JSONField(null=True, default=list)

    # File name
    file_name = models.CharField(max_length=50, default='')

    # Files witch are combined in one group.
    # Of course, there is many-to-one connection, but this is for extra validation
    group_file_id = models.UUIDField(default=uuid.uuid4)

    # Dataset model, that connection with this model. Connection: many to one.
    dataset = models.ForeignKey(DatasetModel, on_delete=models.CASCADE, null=True)

    uploaded_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"file_name: {self.file_name}, group_file_id: {self.group_file_id}"

    class Meta:
        db_table = 'file_handler'
