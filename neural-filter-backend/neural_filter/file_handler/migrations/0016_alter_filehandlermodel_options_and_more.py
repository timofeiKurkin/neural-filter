# Generated by Django 4.2 on 2024-03-03 05:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0015_datasetmodel_alter_filehandlermodel_options_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="filehandlermodel",
            options={},
        ),
        migrations.AlterModelTable(
            name="datasetmodel",
            table="dataset",
        ),
        migrations.AlterModelTable(
            name="filehandlermodel",
            table="file_handler",
        ),
    ]
