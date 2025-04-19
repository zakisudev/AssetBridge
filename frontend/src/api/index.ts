import axios from 'axios';
import {
  Book,
  Review,
  ReviewFormData,
  User,
  LoginData,
  RegisterData,
} from '../types';

const API_URL = 'http://localhost:8000/api';

// Create axios instances - one for auth, one for protected routes
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to refresh token on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        if (response.data.access) {
          localStorage.setItem('accessToken', response.data.access);
          // Set the new access token in the original request
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${response.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginData) => {
    const response = await axios.post(`${API_URL}/token/`, credentials);
    // Store tokens in localStorage
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};

export const bookAPI = {
  getBooks: async (genre?: string, author?: string): Promise<Book[]> => {
    const params: Record<string, string> = {};
    if (genre) params.genre = genre;
    if (author) params.author = author;

    const response = await apiClient.get<Book[]>('/books/', { params });
    return response.data;
  },

  getBookById: async (id: number): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${id}/`);
    return response.data;
  },

  createBook: async (bookData: Partial<Book>): Promise<Book> => {
    const response = await apiClient.post<Book>('/books/', bookData);
    return response.data;
  },

  updateBook: async (id: number, bookData: Partial<Book>): Promise<Book> => {
    const response = await apiClient.patch<Book>(`/books/${id}/`, bookData);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await apiClient.delete(`/books/${id}/`);
  },
};

export const reviewAPI = {
  getReviews: async (bookId?: number): Promise<Review[]> => {
    const params: Record<string, string> = {};
    if (bookId) params.book = bookId.toString();

    const response = await apiClient.get<Review[]>('/reviews/', { params });
    return response.data;
  },

  createReview: async (reviewData: ReviewFormData): Promise<Review> => {
    const response = await apiClient.post<Review>('/reviews/', reviewData);
    return response.data;
  },

  updateReview: async (
    id: number,
    reviewData: Partial<ReviewFormData>
  ): Promise<Review> => {
    const response = await apiClient.patch<Review>(
      `/reviews/${id}/`,
      reviewData
    );
    return response.data;
  },

  deleteReview: async (id: number): Promise<void> => {
    await apiClient.delete(`/reviews/${id}/`);
  },
};
