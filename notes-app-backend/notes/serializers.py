from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "cognito_user_id", "title", "content", "created_at", "updated_at"]
        read_only_fields = ["id", "cognito_user_id", "created_at", "updated_at"]
