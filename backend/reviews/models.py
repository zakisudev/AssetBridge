from django.db import models
from books.models import Book


class Review(models.Model):
    book = models.ForeignKey(Book, related_name="reviews", on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100)
    rating = models.IntegerField()  # Rating out of 5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review for {self.book.title} by {self.user_name}"

    class Meta:
        ordering = ["-created_at"]
