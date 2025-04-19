import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import Login from './components/Login';
import Register from './components/Register';
import AdminBookList from './components/AdminBookList';
import AdminBookForm from './components/AdminBookForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />

          <main className="flex-grow py-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={<ProtectedRoute requireAdmin={true} />}
              >
                <Route path="books" element={<AdminBookList />} />
                <Route path="books/new" element={<AdminBookForm />} />
                <Route
                  path="books/edit/:id"
                  element={<AdminBookForm isEdit />}
                />
              </Route>
            </Routes>
          </main>

          <footer className="bg-gray-200 py-4 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-600">
              &copy; {new Date().getFullYear()} BookReviews. All rights
              reserved.
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
