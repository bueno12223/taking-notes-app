from django.urls import path, include

urlpatterns = [
    path("api/", include("notes.urls")),
    path("api/categories/", include("categories.urls")),
]
