import os
import django
from typing import List, Dict, Any

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "book_review.settings")
django.setup()

from books.models import Book
from reviews.models import Review
from django.utils import timezone
import random


def create_sample_books() -> None:
    """Create sample books for testing"""
    books_data: List[Dict[str, Any]] = [
        {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "genre": "Fiction",
            "published_year": 1960,
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "genre": "Science Fiction",
            "published_year": 1949,
        },
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "genre": "Fiction",
            "published_year": 1925,
        },
        {
            "title": "Pride and Prejudice",
            "author": "Jane Austen",
            "genre": "Romance",
            "published_year": 1813,
        },
        {
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "genre": "Fantasy",
            "published_year": 1937,
        },
        {
            "title": "Harry Potter and the Philosopher's Stone",
            "author": "J.K. Rowling",
            "genre": "Fantasy",
            "published_year": 1997,
        },
        {
            "title": "The Catcher in the Rye",
            "author": "J.D. Salinger",
            "genre": "Fiction",
            "published_year": 1951,
        },
        {
            "title": "The Da Vinci Code",
            "author": "Dan Brown",
            "genre": "Mystery",
            "published_year": 2003,
        },
    ]

    for book_data in books_data:
        Book.objects.get_or_create(**book_data)

    print(f"Created {len(books_data)} books")


def create_sample_reviews() -> None:
    """Create sample reviews for testing"""
    books = Book.objects.all()
    users = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank"]
    comments = [
        "Loved this book!",
        "Not my favorite, but worth reading.",
        "A masterpiece!",
        "Could not put it down.",
        "A bit overrated in my opinion.",
        "Will definitely read again.",
        "Not what I expected.",
        "Changed my perspective on many things.",
    ]

    for book in books:
        num_reviews = random.randint(2, 5)
        for _ in range(num_reviews):
            Review.objects.create(
                book=book,
                rating=random.randint(1, 5),
                comment=random.choice(comments),
                user_name=random.choice(users),
            )

    print(f"Created reviews for {books.count()} books")


if __name__ == "__main__":
    create_sample_books()
    create_sample_reviews()
