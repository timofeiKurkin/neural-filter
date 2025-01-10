# Generated by Django 4.2 on 2024-03-05 02:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0020_alter_datasetmodel_dataset_title"),
    ]

    operations = [
        migrations.AlterField(
            model_name="datasetmodel",
            name="group_file_id",
            field=models.UUIDField(default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name="filehandlermodel",
            name="group_file_id",
            field=models.UUIDField(default=uuid.uuid4),
        ),
    ]
