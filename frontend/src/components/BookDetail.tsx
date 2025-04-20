import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookAPI, reviewAPI } from '../api';
import { Book, Review } from '../types';
import ReviewForm from './ReviewForm';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const bookId = parseInt(id);
      const bookData = await bookAPI.getBookById(bookId);
      setBook(bookData);

      const reviewsData = await reviewAPI.getReviews(bookId);
      setReviews(reviewsData);

      setError(null);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load book details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewAdded = async () => {
    if (id) {
      // Refresh reviews after adding a new one
      try {
        const reviewsData = await reviewAPI.getReviews(parseInt(id));
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error refreshing reviews:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
        </div>
      </div>
    );
  }

  if (error || !book || !id) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error || 'Book not found'}
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Books
        </Link>
      </div>
    );
  }

  const bookId = parseInt(id);

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Books
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{book.avg_rating.toFixed(1)}</span>
          </div>
          <span className="mx-2">•</span>
          <span>{reviews.length} reviews</span>
        </div>

        <div className="mb-4">
          <span className="font-semibold">Author:</span> {book.author}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Genre:</span> {book.genre}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Year:</span> {book.published_year}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      <ReviewForm bookId={bookId} onReviewAdded={handleReviewAdded} />

      {reviews.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded text-center mt-6">
          No reviews yet. Be the first to review this book!
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{review.user_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{review.rating}/5</span>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookDetail;
