# Generated by Django 4.2 on 2024-03-03 04:42

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0010_alter_filehandlermodel_file"),
    ]

    operations = [
        migrations.AddField(
            model_name="filehandlermodel",
            name="group_file_id",
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]
