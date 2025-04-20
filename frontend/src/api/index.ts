import axios from 'axios';
import { Book, Review, ReviewFormData } from '../types';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
