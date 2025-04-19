import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Review } from '../types';
import { bookAPI, reviewAPI } from '../api';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const bookId = parseInt(id);

        // Fetch book and reviews in parallel
        const [bookData, reviewsData] = await Promise.all([
          bookAPI.getBookById(bookId),
          reviewAPI.getReviews(bookId),
        ]);

        setBook(bookData);
        setReviews(reviewsData);
        setError(null);
      } catch (err) {
        setError('Failed to load book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndReviews();
  }, [id]);

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setShowReviewForm(false);
  };

  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const handleReviewDeleted = (reviewId: number) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">Loading book details...</div>
    );
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!book) return <div className="p-8">Book not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="inline-block mb-4 text-blue-600 hover:underline">
        &larr; Back to Book List
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl mb-1">by {book.author}</p>
            <p className="text-gray-600 mb-4">
              {book.genre} • {book.published_year}
            </p>
          </div>
          <div className="bg-blue-100 p-2 rounded flex items-center">
            <span className="text-2xl text-yellow-500 mr-1">★</span>
            <span className="text-xl font-bold">{book.avg_rating}</span>
            <span className="text-gray-600 ml-1">/ 5</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {showReviewForm ? 'Cancel' : 'Add Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-gray-100 p-4 rounded mb-6">
            <ReviewForm
              bookId={parseInt(id as string)}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onReviewUpdated={handleReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
