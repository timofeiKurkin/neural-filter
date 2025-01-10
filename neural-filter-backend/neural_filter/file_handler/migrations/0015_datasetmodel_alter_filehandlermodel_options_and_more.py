# Generated by Django 4.2 on 2024-03-03 05:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("file_handler", "0014_remove_filehandlermodel_file"),
    ]

    operations = [
        migrations.CreateModel(
            name="DatasetModel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("dataset_title", models.CharField(default="", max_length=100)),
            ],
        ),
        migrations.AlterModelOptions(
            name="filehandlermodel",
            options={"verbose_name": "GOPA XYI"},
        ),
        migrations.AddField(
            model_name="filehandlermodel",
            name="dataset",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="file_handler.datasetmodel",
            ),
        ),
    ]
