import uuid

from django.db import models

# Create your models here.


class FileHandlerModel(models.Model):
    # file_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    file = models.FileField()
    file_name = models.CharField(max_length=50, default='')
    file_json = models.JSONField(null=True, default=list)
    uploaded_on = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.uploaded_on.date()
