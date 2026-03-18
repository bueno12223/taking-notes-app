from django.test import TestCase
from notes.models import Note
from notes.services import get_notes_by_user, create_note

class NoteServicesTest(TestCase):
    def setUp(self):
        self.user1 = "user-123"
        self.user2 = "user-456"
        Note.objects.create(cognito_user_id=self.user1, title="User 1 Note", content="Content 1")
        Note.objects.create(cognito_user_id=self.user1, title="User 1 Note 2", content="Content 2")
        Note.objects.create(cognito_user_id=self.user2, title="User 2 Note", content="Content 3")

    def test_get_notes_by_user_returns_only_user_notes(self):
        notes = get_notes_by_user(self.user1)
        self.assertEqual(notes.count(), 2)
        for note in notes:
            self.assertEqual(note.cognito_user_id, self.user1)

    def test_get_notes_by_user_returns_empty_when_no_notes(self):
        notes = get_notes_by_user("non-existent-user")
        self.assertEqual(notes.count(), 0)

    def test_get_notes_by_user_returns_ordered_by_updated_at_descending(self):
        # We need to ensure updated_at is actually different for ordering test
        # but auto_now makes it tricky with fast executions. 
        # Using manual updates to simulate the delta.
        import time
        note1 = Note.objects.get(title="User 1 Note")
        note1.title = "User 1 Note Updated"
        note1.save() # This triggers auto_now update_at
        
        # note1 should now be first if ordered by updated_at desc
        notes = get_notes_by_user(self.user1)
        self.assertEqual(notes[0].title, "User 1 Note Updated")

    def test_create_note_saves_to_db_with_correct_user(self):
        note = create_note(
            cognito_user_id="user-999",
            title="New valid note",
            content="Some content",
            category="brand-peach"
        )
        self.assertEqual(note.cognito_user_id, "user-999")
        self.assertEqual(Note.objects.filter(cognito_user_id="user-999").count(), 1)
        
    def test_create_note_handles_null_category(self):
        note = create_note(
            cognito_user_id="user-888",
            title="Null category note",
            content="More content",
            category=None
        )
        self.assertIsNone(note.category)
        self.assertEqual(Note.objects.filter(cognito_user_id="user-888").count(), 1)
