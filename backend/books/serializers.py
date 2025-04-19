from rest_framework import serializers
from .models import Book
from reviews.models import Review
from typing import Dict, Any, List


class BookSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "genre",
            "published_year",
            "created_at",
            "updated_at",
            "avg_rating",
        ]

    def get_avg_rating(self, obj: Book) -> float:
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        total_rating = sum(review.rating for review in reviews)
        return round(total_rating / len(reviews), 1)
