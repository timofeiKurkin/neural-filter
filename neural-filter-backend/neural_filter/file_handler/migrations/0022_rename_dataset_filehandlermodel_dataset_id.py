# Generated by Django 4.2 on 2024-03-13 08:36

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0021_alter_datasetmodel_group_file_id_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="filehandlermodel",
            old_name="dataset",
            new_name="dataset_id",
        ),
    ]
