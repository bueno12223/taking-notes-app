from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from ..authentication import CognitoAuthentication
from .services import transcribe_audio

class TranscriptionView(APIView):
    """
    API endpoint that accepts raw PCM audio data and returns transcribed text.
    Expects pcm_s16le 16kHz mono audio in the request body.
    """
    authentication_classes = [CognitoAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        audio_data = request.body
        
        if not audio_data:
            return Response(
                {"error": "No audio data provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            transcript = async_to_sync(transcribe_audio)(audio_data)
            
            if not transcript:
                return Response(
                    {"error": "Could not transcribe audio. It might be too short or silent."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            return Response({"transcript": transcript}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
