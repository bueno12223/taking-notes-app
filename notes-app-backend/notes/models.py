from django.db import models


class Note(models.Model):
    CATEGORY_CHOICES = [
        ("brand-peach", "Random Thoughts"),
        ("brand-cream", "School"),
        ("brand-teal", "Personal"),
    ]

    cognito_user_id = models.CharField(max_length=128)
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
