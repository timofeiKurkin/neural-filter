# Generated by Django 4.2 on 2024-03-03 07:13

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0017_datasetmodel_group_file_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="datasetmodel",
            name="accuracy",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="datasetmodel",
            name="loss",
            field=models.FloatField(default=0.0),
        ),
    ]
