import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { bookAPI } from '../api';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookAPI.getBooks(
          genreFilter || undefined,
          authorFilter || undefined
        );
        setBooks(data);

        // Extract unique genres and authors for filters
        const uniqueGenres = Array.from(
          new Set(data.map((book) => book.genre))
        );
        const uniqueAuthors = Array.from(
          new Set(data.map((book) => book.author))
        );
        setGenres(uniqueGenres);
        setAuthors(uniqueAuthors);

        setError(null);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genreFilter, authorFilter]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreFilter(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthorFilter(e.target.value);
  };

  const clearFilters = () => {
    setGenreFilter('');
    setAuthorFilter('');
  };

  if (loading)
    return <div className="flex justify-center p-8">Loading books...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book Reviews</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Genre
            </label>
            <select
              id="genre"
              className="p-2 border rounded w-full"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Author
            </label>
            <select
              id="author"
              className="p-2 border rounded w-full"
              value={authorFilter}
              onChange={handleAuthorChange}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="p-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <p>No books found. Try changing your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              to={`/books/${book.id}`}
              key={book.id}
              className="block border rounded-lg hover:shadow-lg transition-shadow p-4"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{book.avg_rating}</span>
                </div>
              </div>
              <p className="text-gray-700">by {book.author}</p>
              <p className="text-gray-600 text-sm">
                {book.genre} • {book.published_year}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
