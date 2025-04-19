from rest_framework import serializers
from .models import Review
from django.contrib.auth.models import User
from typing import Dict, Any, List


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ["id"]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data: Dict[str, Any]) -> User:
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "book",
            "user",
            "username",
            "rating",
            "comment",
            "created_at",
            "updated_at",
            "is_owner",
        ]
        read_only_fields = ["user", "username", "is_owner"]

    def get_username(self, obj: Review) -> str:
        if obj.user is None:
            return (
                obj.user_name or "Anonymous"
            )  # Use user_name if available, otherwise "Anonymous"
        return obj.user.username

    def get_is_owner(self, obj: Review) -> bool:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.user == request.user
        return False


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["book", "rating", "comment"]

    def validate_rating(self, value: int) -> int:
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def create(self, validated_data: Dict[str, Any]) -> Review:
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)
