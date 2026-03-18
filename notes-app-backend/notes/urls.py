from django.urls import path, include
from .views import NoteListCreateView, NoteDetailView

urlpatterns = [
    path("notes/", NoteListCreateView.as_view(), name="note-list"),
    path("notes/<int:note_id>/", NoteDetailView.as_view(), name="note-detail"),
    path("", include("notes.transcription.urls")),
]
