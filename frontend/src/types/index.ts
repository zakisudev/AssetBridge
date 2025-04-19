export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  published_year: number;
  created_at: string;
  updated_at: string;
  avg_rating: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface Review {
  id: number;
  book: number;
  user: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
}

export interface ReviewFormData {
  book: number;
  rating: number;
  comment: string;
}
