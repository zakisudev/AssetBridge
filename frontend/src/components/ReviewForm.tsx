import { useState, FormEvent } from 'react';
import { Review, ReviewFormData } from '../types';
import { reviewAPI } from '../api';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  bookId: number;
  initialData?: {
    rating: number;
    comment: string;
  };
  reviewId?: number;
  onReviewAdded: (review: Review) => void;
  onCancel?: () => void;
}

const ReviewForm = ({
  bookId,
  initialData,
  reviewId,
  onReviewAdded,
  onCancel,
}: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!comment.trim()) {
      newErrors.comment = 'Comment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const reviewData: ReviewFormData = {
      book: bookId,
      rating,
      comment,
    };

    try {
      setIsSubmitting(true);

      let response;
      if (reviewId) {
        // Update existing review
        response = await reviewAPI.updateReview(reviewId, reviewData);
      } else {
        // Create new review
        response = await reviewAPI.createReview(reviewData);
      }

      onReviewAdded(response);
      if (!reviewId) {
        // Clear form if it's a new review
        setRating(5);
        setComment('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
        Please log in to add a review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Rating (1-5)
        </label>
        <div className="flex text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              } focus:outline-none`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Your Review
          </label>
          <span className="ml-auto text-sm text-gray-500">
            Posting as <span className="font-semibold">{user.username}</span>
          </span>
        </div>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className={`w-full p-2 border rounded ${
            errors.comment ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write your review here..."
        />
        {errors.comment && (
          <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isSubmitting
            ? 'Submitting...'
            : reviewId
            ? 'Update Review'
            : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
