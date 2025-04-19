import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { bookAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const AdminBookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookAPI.getBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isAdmin, navigate]);

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this book? This action cannot be undone.'
      )
    ) {
      setDeleteId(id);
      setIsDeleting(true);

      try {
        await bookAPI.deleteBook(id);
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } catch (err) {
        setError('Failed to delete book');
        console.error(err);
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading books...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Management</h1>
        <Link
          to="/admin/books/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="text-center py-8">
          No books available. Add your first book!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Author</th>
                <th className="py-2 px-4 text-left">Genre</th>
                <th className="py-2 px-4 text-left">Year</th>
                <th className="py-2 px-4 text-left">Rating</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{book.title}</td>
                  <td className="py-2 px-4">{book.author}</td>
                  <td className="py-2 px-4">{book.genre}</td>
                  <td className="py-2 px-4">{book.published_year}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{book.avg_rating}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/books/edit/${book.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={isDeleting && deleteId === book.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {isDeleting && deleteId === book.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                      <Link
                        to={`/books/${book.id}`}
                        className="text-green-600 hover:text-green-800"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookList;
