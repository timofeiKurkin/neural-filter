# Generated by Django 4.2 on 2024-03-04 13:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0018_datasetmodel_accuracy_datasetmodel_loss"),
    ]

    operations = [
        migrations.AddField(
            model_name="datasetmodel",
            name="count_files",
            field=models.IntegerField(default=0),
        ),
    ]
