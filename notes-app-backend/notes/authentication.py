from typing import Optional

import requests
from django.conf import settings
from jose import JWTError, jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request

_jwks_cache: Optional[dict[str, list[dict[str, str]]]] = None


def _fetch_jwks() -> dict[str, list[dict[str, str]]]:
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache
    url = (
        f"https://cognito-idp.{settings.AWS_REGION}.amazonaws.com"
        f"/{settings.COGNITO_USER_POOL_ID}/.well-known/jwks.json"
    )
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    _jwks_cache = response.json()
    return _jwks_cache


class CognitoAuthentication(BaseAuthentication):
    def authenticate(self, request: Request) -> Optional[tuple[str, None]]:
        auth_header: str = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ", 1)[1]

        try:
            jwks = _fetch_jwks()
            payload: dict[str, str] = jwt.decode(
                token,
                jwks,
                algorithms=["RS256"],
                options={"verify_aud": False},
            )
        except JWTError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        if payload.get("token_use") != "access":
            raise AuthenticationFailed("Token must be an access token.")

        if payload.get("client_id") != settings.COGNITO_APP_CLIENT_ID:
            raise AuthenticationFailed("Token client_id does not match.")

        return (payload["sub"], None)
