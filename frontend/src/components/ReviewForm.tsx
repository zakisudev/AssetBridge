import React, { useState } from 'react';
import { reviewAPI } from '../api';
import { ReviewFormData } from '../types';

interface ReviewFormProps {
  bookId: number;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    const reviewData: ReviewFormData = {
      book: bookId,
      user_name: userName,
      rating,
      comment,
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await reviewAPI.createReview(reviewData);
      // Reset form after submission
      setRating(5);
      setComment('');
      setUserName('');
      onReviewAdded();
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="rating" className="block text-gray-700 mb-1">
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? 'Star' : 'Stars'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
