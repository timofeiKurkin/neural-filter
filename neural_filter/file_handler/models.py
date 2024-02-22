import uuid

from django.db import models

# Create your models here.


class FileHandlerModel(models.Model):
    # file_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    file = models.FileField()
    uploaded_on = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.uploaded_on.date()
