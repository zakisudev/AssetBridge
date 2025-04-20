from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import QuerySet
from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "author", "genre"]
    ordering_fields = ["title", "author", "published_year", "created_at"]

    def get_queryset(self):
        queryset = Book.objects.all()
        genre = self.request.query_params.get("genre")
        author = self.request.query_params.get("author")

        if genre:
            queryset = queryset.filter(genre__iexact=genre)
        if author:
            queryset = queryset.filter(author__icontains=author)

        return queryset
