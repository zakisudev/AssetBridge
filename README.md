# Book Review Platform

A full-stack application where users can browse books, view details, and manage reviews.

## Features

- Browse a list of books
- Filter books by genre and author
- View book details
- Add, edit, and delete reviews
- See average ratings for each book

## Tech Stack

### Backend

- Django
- Django REST Framework
- SQLite database
- Type checking with mypy

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Apply migrations:

```bash
python manage.py migrate
```

5. Load sample data (optional):

```bash
python seed_data.py
```

6. Start the development server:

```bash
python manage.py runserver
```

The backend API will be available at http://localhost:8000/api/

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend application will be available at http://localhost:5173/

## API Endpoints

- `GET /api/books/` - List all books
- `GET /api/books/?genre=Fiction` - Filter books by genre
- `GET /api/books/?author=J.K.+Rowling` - Filter books by author
- `GET /api/books/<id>/` - Get book details
- `GET /api/reviews/` - List all reviews
- `GET /api/reviews/?book=1` - Get reviews for a specific book
- `POST /api/reviews/` - Create a new review
- `PATCH /api/reviews/<id>/` - Update a review
- `DELETE /api/reviews/<id>/` - Delete a review
