from django.db import models


class Note(models.Model):
    cognito_user_id = models.CharField(max_length=128)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
