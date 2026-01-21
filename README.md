# Todo Full-Stack Web Application

This is a full-stack todo application built with Next.js, FastAPI, SQLModel, and Neon PostgreSQL.

## Features

- User registration and authentication
- Create, read, update, and delete todos
- Multi-user support with data isolation
- Responsive web interface
- RESTful API endpoints

## Tech Stack

- **Frontend**: Next.js with App Router
- **Backend**: FastAPI
- **Database**: SQLModel with Neon PostgreSQL
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS

## API Endpoints

- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/users/me` - Get current user
- `GET /api/{user_id}/tasks` - Get user's todos
- `POST /api/{user_id}/tasks` - Create a new todo
- `GET /api/{user_id}/tasks/{id}` - Get a specific todo
- `PUT /api/{user_id}/tasks/{id}` - Update a todo
- `PATCH /api/{user_id}/tasks/{id}/complete` - Mark todo as complete/incomplete
- `DELETE /api/{user_id}/tasks/{id}` - Delete a todo

## Project Structure

```
├── backend/                 # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── models/             # Database models
│   ├── schemas/            # API schemas
│   ├── api/                # API route handlers
│   ├── services/           # Business logic
│   ├── database/           # Database configuration
│   └── core/               # Core utilities
├── frontend/               # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and API client
│   └── styles/             # Global styles
└── specs/                  # Feature specifications
    └── 2-todo-fullstack-web/
        └── spec.md         # Feature specification
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Environment Variables

### Backend

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret key for JWT tokens
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Frontend

- `NEXT_PUBLIC_BACKEND_API_URL`: URL of the backend API (default: http://localhost:8000)

## Database Migrations

To run database migrations:

```bash
cd backend
alembic upgrade head
```

To create a new migration:

```bash
alembic revision --autogenerate -m "Description of changes"
```

## Running the Application

1. Start the backend:
```bash
cd backend
uvicorn main:app --reload
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000 and will connect to the backend at http://localhost:8000/api.