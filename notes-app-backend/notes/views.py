from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .authentication import CognitoAuthentication
from .serializers import NoteSerializer
from .services import get_notes_by_user


class NoteListView(APIView):
    """
    Handles listing notes for the authenticated user.
    """
    authentication_classes = [CognitoAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves all notes for the authenticated Cognito user.
        The user_id is extracted from request.user (set by CognitoAuthentication).
        """
        cognito_user_id = str(request.user)
        notes = get_notes_by_user(cognito_user_id)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
