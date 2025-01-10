from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.management.base import BaseCommand
from dotenv import dotenv_values

env = dotenv_values("../.env")


class Command(BaseCommand):
    help = "Create a superuser if not exists"

    def handle(self, *args, **options):
        username = env["SUPERUSER_NAME"]
        email = env["SUPERUSER_EMAIL"]
        password = env["SUPERUSER_PASSWORD"]

        if not username or not email or not password:
            self.stdout.write(self.style.ERROR("Missing env variables"))
            return

        try:
            User.objects.get(username=username)
            self.stdout.write(self.style.WARNING("Superuser already exists."))
        except ObjectDoesNotExist:
            User.objects.create_superuser(
                username=username, email=email, password=password
            )
            self.stdout.write(self.style.SUCCESS("Superuser created."))
