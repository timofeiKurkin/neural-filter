# Generated by Django 4.2 on 2024-02-23 02:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('file_handler', '0007_filehandlermodel_file_json'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filehandlermodel',
            name='file_json',
            field=models.JSONField(default=list, null=True),
        ),
    ]
