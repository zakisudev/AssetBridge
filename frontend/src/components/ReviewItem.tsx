import { useState } from 'react';
import { Review } from '../types';
import { reviewAPI } from '../api';
import ReviewForm from './ReviewForm';

interface ReviewItemProps {
  review: Review;
  onReviewUpdated: (review: Review) => void;
  onReviewDeleted: (id: number) => void;
}

const ReviewItem = ({
  review,
  onReviewUpdated,
  onReviewDeleted,
}: ReviewItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setIsDeleting(true);
        await reviewAPI.deleteReview(review.id);
        onReviewDeleted(review.id);
      } catch (err) {
        console.error('Failed to delete review:', err);
        alert('Failed to delete review');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span
          key={i}
          className={`${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          ★
        </span>
      ));
  };

  return (
    <div className="border p-4 rounded-lg bg-white">
      {isEditing ? (
        <div className="mb-2">
          <h3 className="font-bold mb-2">Edit Review</h3>
          <ReviewForm
            bookId={review.book}
            initialData={{
              rating: review.rating,
              comment: review.comment,
            }}
            reviewId={review.id}
            onReviewAdded={onReviewUpdated}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-1">
                <span className="font-bold mr-2">{review.username}</span>
                <span className="text-gray-500 text-sm">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <div className="text-lg mb-2">{renderStars(review.rating)}</div>
            </div>
            {review.is_owner && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </>
      )}
    </div>
  );
};

export default ReviewItem;
