from django.shortcuts import render
from rest_framework import viewsets, filters, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import QuerySet
from typing import Any, Dict
from .models import Book
from .serializers import BookSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to create, update or delete books.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to staff/admin users
        return request.user.is_authenticated and request.user.is_staff


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "author", "genre"]
    ordering_fields = ["title", "author", "published_year", "created_at"]
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self) -> QuerySet:
        queryset = Book.objects.all()
        genre = self.request.query_params.get("genre")
        author = self.request.query_params.get("author")

        if genre:
            queryset = queryset.filter(genre__iexact=genre)
        if author:
            queryset = queryset.filter(author__icontains=author)

        return queryset
