from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user_name", "comment"]
    ordering_fields = ["rating", "created_at"]

    def get_queryset(self):
        queryset = Review.objects.all()
        book_id = self.request.query_params.get("book")

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        return queryset
