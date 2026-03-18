import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "local-dev-secret-key-change-in-production")

DEBUG = os.environ.get("DEBUG", "True") == "True"

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost 127.0.0.1 0.0.0.0").split()

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "notes",
]

MIDDLEWARE: list = []

ROOT_URLCONF = "notes_project.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "notes_db"),
        "USER": os.environ.get("POSTGRES_USER", "notes_user"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "notes_pass"),
        "HOST": os.environ.get("POSTGRES_HOST", "db"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
