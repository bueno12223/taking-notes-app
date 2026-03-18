from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from notes.models import Note
from notes.authentication import CognitoUser


TIPTAP_CONTENT = {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Hello"}]}]}


class NoteListViewTests(APITestCase):
    def setUp(self):
        self.url = reverse("note-list")
        self.user1 = "user-123"
        self.user2 = "user-456"
        Note.objects.create(cognito_user_id=self.user1, title="User 1 Note", content=TIPTAP_CONTENT, category="brand-peach")
        Note.objects.create(cognito_user_id=self.user2, title="User 2 Note", content=TIPTAP_CONTENT, category="brand-peach")

    def test_unauthenticated_request_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_authenticated_request_returns_notes_for_user_only(self, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user1), None)

        response = self.client.get(self.url, HTTP_AUTHORIZATION="Bearer dummy-token")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "User 1 Note")
        self.assertEqual(response.data[0]["cognito_user_id"], self.user1)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_authenticated_request_with_no_notes_returns_empty_list(self, mock_auth):
        mock_auth.return_value = (CognitoUser("new-user"), None)

        response = self.client.get(self.url, HTTP_AUTHORIZATION="Bearer dummy-token")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class NoteCreateViewTests(APITestCase):
    def setUp(self):
        self.url = reverse("note-list")
        self.user_id = "user-789"

    def test_unauthenticated_request_returns_403(self):
        response = self.client.post(self.url, {"title": "T", "content": {}}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_valid_request_returns_201_with_created_note(self, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user_id), None)
        payload = {"title": "My note", "content": TIPTAP_CONTENT, "category": "brand-peach"}

        response = self.client.post(self.url, payload, HTTP_AUTHORIZATION="Bearer dummy-token", format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "My note")
        self.assertEqual(response.data["category"], "brand-peach")
        self.assertEqual(response.data["cognito_user_id"], self.user_id)
        self.assertEqual(Note.objects.filter(cognito_user_id=self.user_id).count(), 1)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_invalid_category_returns_400(self, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user_id), None)
        payload = {"title": "My note", "content": TIPTAP_CONTENT, "category": "invalid-category"}

        response = self.client.post(self.url, payload, HTTP_AUTHORIZATION="Bearer dummy-token", format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category", response.data)


class NoteDetailViewTests(APITestCase):
    def setUp(self):
        self.user_id = "user-patch-123"
        self.other_user_id = "user-other-456"
        self.note = Note.objects.create(
            cognito_user_id=self.user_id,
            title="Original Title",
            content=TIPTAP_CONTENT,
            category="brand-peach",
        )
        self.url = reverse("note-detail", kwargs={"note_id": self.note.id})

    def test_unauthenticated_patch_returns_403(self):
        response = self.client.patch(self.url, {"title": "X"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_valid_patch_returns_200_with_updated_note(self, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user_id), None)
        payload = {"title": "Updated Title"}

        response = self.client.patch(self.url, payload, HTTP_AUTHORIZATION="Bearer dummy-token", format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Title")
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, "Updated Title")

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_patch_wrong_user_returns_404(self, mock_auth):
        mock_auth.return_value = (CognitoUser(self.other_user_id), None)

        response = self.client.patch(
            self.url, {"title": "Hijacked"}, HTTP_AUTHORIZATION="Bearer dummy-token", format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
