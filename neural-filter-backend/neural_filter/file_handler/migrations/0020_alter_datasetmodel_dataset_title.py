# Generated by Django 4.2 on 2024-03-04 14:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0019_datasetmodel_count_files"),
    ]

    operations = [
        migrations.AlterField(
            model_name="datasetmodel",
            name="dataset_title",
            field=models.CharField(max_length=50),
        ),
    ]
