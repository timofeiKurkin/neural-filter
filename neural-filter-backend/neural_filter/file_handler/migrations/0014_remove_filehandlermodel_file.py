# Generated by Django 4.2 on 2024-03-03 04:45

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0013_rename_json_of_file_filehandlermodel_file_data"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="filehandlermodel",
            name="file",
        ),
    ]
