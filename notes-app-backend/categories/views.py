from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from notes.models import Note


class CategoryListView(APIView):
    def get(self, request: Request) -> Response:
        categories = [
            {"value": value, "label": label}
            for value, label in Note.CATEGORY_CHOICES
        ]
        return Response(categories)
