import asyncio
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent
from django.conf import settings

class TranscriptionEventHandler(TranscriptResultStreamHandler):
    def __init__(self, output_stream):
        super().__init__(output_stream)
        self.transcript = ""

    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        results = transcript_event.transcript.results
        for result in results:
            if not result.is_partial:
                for alt in result.alternatives:
                    self.transcript += alt.transcript + " "

async def transcribe_audio(audio_bytes: bytes, language_code: str = "en-US") -> str:
    """
    Streams raw PCM audio bytes to AWS Transcribe and returns the final transcript.
    
    :param audio_bytes: Raw pcm_s16le 16kHz mono audio data.
    :param language_code: AWS language code (default en-US).
    :return: Transcribed text string.
    """
    if not audio_bytes:
        return ""

    client = TranscribeStreamingClient(region=settings.AWS_REGION)
    
    stream = await client.start_stream_transcription(
        language_code=language_code,
        media_sample_rate_hz=16000,
        media_encoding="pcm",
    )

    handler = TranscriptionEventHandler(stream.output_stream)
    
    async def send_audio():
        chunk_size = 1024 * 16
        for i in range(0, len(audio_bytes), chunk_size):
            await stream.input_stream.send_audio_event(audio_chunk=audio_bytes[i:i+chunk_size])
        await stream.input_stream.end_stream()
    await asyncio.gather(send_audio(), handler.handle_events())
    
    return handler.transcript.strip()
