from typing import Optional
from unittest.mock import patch

from django.test import TestCase, override_settings
from jose import JWTError
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIRequestFactory

from notes.authentication import CognitoAuthentication

COGNITO_SETTINGS = {
    "COGNITO_APP_CLIENT_ID": "test-client-id",
    "COGNITO_USER_POOL_ID": "us-east-1_TestPool",
    "AWS_REGION": "us-east-1",
}

VALID_PAYLOAD = {"sub": "user-123", "token_use": "access", "client_id": "test-client-id"}
FAKE_JWKS: dict[str, list[dict[str, str]]] = {"keys": []}


@override_settings(**COGNITO_SETTINGS)
class CognitoAuthenticationTest(TestCase):
    def setUp(self) -> None:
        self.auth = CognitoAuthentication()
        self.factory = APIRequestFactory()

    def _make_request(self, token: Optional[str] = None):
        request = self.factory.get("/")
        if token is not None:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"
        return request

    @patch("notes.authentication._fetch_jwks", return_value=FAKE_JWKS)
    @patch("notes.authentication.jwt.decode", return_value=VALID_PAYLOAD)
    def test_valid_token_returns_sub(self, _mock_decode, _mock_jwks) -> None:
        result = self.auth.authenticate(self._make_request("valid.token.here"))
        self.assertEqual(result, ("user-123", None))

    def test_missing_header_returns_none(self) -> None:
        result = self.auth.authenticate(self._make_request())
        self.assertIsNone(result)

    @patch("notes.authentication._fetch_jwks", return_value=FAKE_JWKS)
    @patch("notes.authentication.jwt.decode", side_effect=JWTError("bad token"))
    def test_invalid_token_raises_authentication_failed(self, _mock_decode, _mock_jwks) -> None:
        with self.assertRaises(AuthenticationFailed):
            self.auth.authenticate(self._make_request("bad.token"))

    @patch("notes.authentication._fetch_jwks", return_value=FAKE_JWKS)
    @patch(
        "notes.authentication.jwt.decode",
        return_value={"sub": "user-x", "token_use": "id", "client_id": "test-client-id"},
    )
    def test_id_token_raises_authentication_failed(self, _mock_decode, _mock_jwks) -> None:
        with self.assertRaises(AuthenticationFailed):
            self.auth.authenticate(self._make_request("id.token.here"))

    @patch("notes.authentication._fetch_jwks", return_value=FAKE_JWKS)
    @patch(
        "notes.authentication.jwt.decode",
        return_value={"sub": "user-x", "token_use": "access", "client_id": "wrong-client"},
    )
    def test_mismatched_client_id_raises_authentication_failed(self, _mock_decode, _mock_jwks) -> None:
        with self.assertRaises(AuthenticationFailed):
            self.auth.authenticate(self._make_request("token.wrong.client"))
