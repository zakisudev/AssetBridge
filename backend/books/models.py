from django.db import models
from django.db.models import Avg


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    published_year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def avg_rating(self):
        return self.reviews.aggregate(Avg("rating"))["rating__avg"] or 0

    class Meta:
        ordering = ["-created_at"]
