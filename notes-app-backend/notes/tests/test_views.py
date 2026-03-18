from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from notes.models import Note
from notes.authentication import CognitoUser


class NoteListViewTests(APITestCase):
    def setUp(self):
        self.url = reverse("note-list")
        self.user1 = "user-123"
        self.user2 = "user-456"
        Note.objects.create(cognito_user_id=self.user1, title="User 1 Note", content="Content 1")
        Note.objects.create(cognito_user_id=self.user2, title="User 2 Note", content="Content 2")

    def test_unauthenticated_request_returns_401(self):
        # By default no token - should return 403 (Forbidden) without challenge
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
