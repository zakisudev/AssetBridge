from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("book", "rating", "user_name", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("book__title", "user_name", "comment")
