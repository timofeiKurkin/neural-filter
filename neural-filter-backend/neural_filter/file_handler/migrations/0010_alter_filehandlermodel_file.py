# Generated by Django 4.2 on 2024-02-29 01:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0009_filehandlermodel_file_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="filehandlermodel",
            name="file",
            field=models.FileField(upload_to="packets/"),
        ),
    ]
