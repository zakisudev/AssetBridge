from django.db import migrations
from django.contrib.auth.models import User


def migrate_usernames(apps, schema_editor):
    """
    Migrate reviews with null users but with user_name values.
    Try to assign them to existing users with matching usernames,
    or create placeholder users if needed.
    """
    Review = apps.get_model("reviews", "Review")

    # Get all reviews with null user but with user_name
    reviews_to_update = (
        Review.objects.filter(user__isnull=True)
        .exclude(user_name__isnull=True)
        .exclude(user_name="")
    )

    for review in reviews_to_update:
        # Try to find a user with matching username
        try:
            user = User.objects.get(username=review.user_name)
            review.user = user
            review.save()
            print(f"Assigned review {review.id} to existing user {user.username}")
        except User.DoesNotExist:
            # User doesn't exist, keep it with user=None
            # The serializer will now handle this gracefully
            print(f"Could not find user for username: {review.user_name}")

    # For reviews with no user and no user_name, set a placeholder user_name
    anon_reviews = Review.objects.filter(user__isnull=True, user_name__isnull=True)
    for i, review in enumerate(anon_reviews):
        review.user_name = f"Anonymous-{i+1}"
        review.save()
        print(f"Set placeholder username for review {review.id}")


class Migration(migrations.Migration):

    dependencies = [
        (
            "reviews",
            "0001_initial",
        ),  # Adjust this to the last migration in your reviews app
    ]

    operations = [
        migrations.RunPython(migrate_usernames),
    ]
