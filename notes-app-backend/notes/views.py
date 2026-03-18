from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .authentication import CognitoAuthentication
from .serializers import NoteSerializer
from .services import get_notes_by_user, create_note, update_note
from .models import Note


class NoteListCreateView(APIView):
    authentication_classes = [CognitoAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cognito_user_id = str(request.user)
        notes = get_notes_by_user(cognito_user_id)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            cognito_user_id = str(request.user)
            note = create_note(
                cognito_user_id=cognito_user_id,
                title=serializer.validated_data["title"],
                content=serializer.validated_data["content"],
                category=serializer.validated_data.get("category"),
            )
            response_serializer = NoteSerializer(note)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NoteDetailView(APIView):
    authentication_classes = [CognitoAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, note_id):
        serializer = NoteSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        cognito_user_id = str(request.user)
        try:
            note = update_note(
                note_id=note_id,
                cognito_user_id=cognito_user_id,
                updates=serializer.validated_data,
            )
        except Note.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(NoteSerializer(note).data, status=status.HTTP_200_OK)
