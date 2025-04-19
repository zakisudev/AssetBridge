import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookAPI } from '../api';
import { useAuth } from '../context/AuthContext';

interface AdminBookFormProps {
  isEdit?: boolean;
}

const AdminBookForm: React.FC<AdminBookFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publishedYear, setPublishedYear] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // If editing, load existing book data
    if (isEdit && id) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const book = await bookAPI.getBookById(parseInt(id));
          setTitle(book.title);
          setAuthor(book.author);
          setGenre(book.genre);
          setPublishedYear(book.published_year);
        } catch (err) {
          setError('Failed to load book');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    }
  }, [id, isEdit, isAdmin, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !author.trim() || !genre.trim() || !publishedYear) {
      setError('Please fill in all fields');
      return;
    }

    const bookData = {
      title,
      author,
      genre,
      published_year: Number(publishedYear),
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await bookAPI.updateBook(parseInt(id), bookData);
      } else {
        await bookAPI.createBook(bookData);
      }

      navigate('/admin/books');
    } catch (err) {
      setError('Failed to save book');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Book' : 'Add New Book'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Genre
          </label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="publishedYear"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Published Year
          </label>
          <input
            id="publishedYear"
            type="number"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
            min="1"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/books')}
            className="flex-1 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBookForm;
