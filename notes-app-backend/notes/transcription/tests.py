from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from notes.authentication import CognitoUser

class TranscriptionTests(APITestCase):
    def setUp(self):
        self.url = reverse("transcribe")
        self.user_id = "test-user-id"

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    @patch("notes.transcription.views.transcribe_audio")
    @patch("notes.transcription.views.async_to_sync")
    def test_transcription_success(self, mock_async_to_sync, mock_transcribe, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user_id), None)
        
        mock_async_to_sync.return_value = lambda x: "This is a test transcript"

        audio_data = b"\x00\x01" * 100
        
        response = self.client.generic(
            "POST",
            self.url, 
            data=audio_data, 
            content_type="application/octet-stream",
            HTTP_AUTHORIZATION="Bearer dummy-token"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["transcript"], "This is a test transcript")
        mock_async_to_sync.assert_called_once_with(mock_transcribe)

    def test_unauthenticated_request_returns_403(self):
        response = self.client.generic("POST", self.url, data=b"data")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_empty_audio_returns_400(self, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user_id), None)
        
        response = self.client.generic(
            "POST",
            self.url, 
            data=b"", 
            content_type="application/octet-stream",
            HTTP_AUTHORIZATION="Bearer dummy-token"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    @patch("notes.transcription.views.transcribe_audio")
    @patch("notes.transcription.views.async_to_sync")
    def test_transcription_failure_returns_500(self, mock_async_to_sync, mock_transcribe, mock_auth):
        mock_auth.return_value = (CognitoUser(self.user_id), None)
        
        def side_effect(x):
            raise Exception("AWS Error")
        mock_async_to_sync.return_value = side_effect

        response = self.client.generic(
            "POST",
            self.url, 
            data=b"some audio data",
            content_type="application/octet-stream",
            HTTP_AUTHORIZATION="Bearer dummy-token"
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data["error"], "AWS Error")
