# Generated by Django 4.2 on 2024-02-20 05:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('file_handler', '0002_rename_filehandler_filehandlermodel'),
    ]

    operations = [
        migrations.RenameField(
            model_name='filehandlermodel',
            old_name='file',
            new_name='files',
        ),
    ]
