from django.db.models import QuerySet
from .models import Note


def get_notes_by_user(cognito_user_id: str) -> QuerySet[Note]:
    """
    Fetches all notes belonging to a specific Cognito user.
    Results are ordered by updated_at descending.
    """
    return Note.objects.filter(cognito_user_id=cognito_user_id).order_by("-updated_at")
