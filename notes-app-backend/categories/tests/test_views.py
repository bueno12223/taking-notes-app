from unittest.mock import patch
from rest_framework import status
from rest_framework.test import APITestCase
from notes.authentication import CognitoUser
from notes.models import Note


class CategoryListViewTests(APITestCase):
    def setUp(self):
        self.url = "/api/categories/"
        self.expected_categories = [
            {"value": value, "label": label}
            for value, label in Note.CATEGORY_CHOICES
        ]

    def test_unauthenticated_request_returns_403(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_authenticated_request_returns_all_categories(self, mock_auth):
        mock_auth.return_value = (CognitoUser("user-123"), None)

        response = self.client.get(self.url, HTTP_AUTHORIZATION="Bearer dummy-token")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.expected_categories)

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_response_contains_expected_number_of_categories(self, mock_auth):
        mock_auth.return_value = (CognitoUser("user-123"), None)

        response = self.client.get(self.url, HTTP_AUTHORIZATION="Bearer dummy-token")

        self.assertEqual(len(response.data), len(Note.CATEGORY_CHOICES))

    @patch("notes.authentication.CognitoAuthentication.authenticate")
    def test_each_category_has_value_and_label_keys(self, mock_auth):
        mock_auth.return_value = (CognitoUser("user-123"), None)

        response = self.client.get(self.url, HTTP_AUTHORIZATION="Bearer dummy-token")

        for category in response.data:
            self.assertIn("value", category)
            self.assertIn("label", category)
