from django.db.models import QuerySet
from .models import Note


def get_notes_by_user(cognito_user_id: str) -> QuerySet[Note]:
    """
    Fetches all notes belonging to a specific Cognito user.
    Results are ordered by updated_at descending.
    """
    return Note.objects.filter(cognito_user_id=cognito_user_id).order_by("-updated_at")


def create_note(cognito_user_id: str, title: str, content: str, category: str) -> Note:
    """
    Creates a new note for the given user.
    """
    return Note.objects.create(
        cognito_user_id=cognito_user_id,
        title=title,
        content=content,
        category=category,
    )


def update_note(note_id: int, cognito_user_id: str, updates: dict) -> Note:
    note = Note.objects.get(id=note_id, cognito_user_id=cognito_user_id)
    for field, value in updates.items():
        setattr(note, field, value)
    note.save()
    return note
