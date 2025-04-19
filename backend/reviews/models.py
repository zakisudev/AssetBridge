from django.db import models
from books.models import Book
from django.contrib.auth.models import User
from typing import Any


class Review(models.Model):
    book = models.ForeignKey(Book, related_name="reviews", on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name="reviews", on_delete=models.CASCADE, null=True
    )
    rating = models.IntegerField()  # Rating out of 5
    comment = models.TextField()
    user_name = models.CharField(
        max_length=100, null=True, blank=True
    )  # Keep temporarily for migration
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        if self.user:
            return f"Review for {self.book.title} by {self.user.username}"
        return f"Review for {self.book.title}"

    class Meta:
        ordering = ["-created_at"]
