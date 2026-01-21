# Quickstart: Todo Full-Stack Web Application

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (or Neon PostgreSQL account)
- Git

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secret key
   ```

5. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Authenticate user and get token
- `GET /api/users/me` - Get current user info

### Todo Operations
- `GET /api/{user_id}/tasks` - Get user's todos
- `POST /api/{user_id}/tasks` - Create new todo
- `GET /api/{user_id}/tasks/{id}` - Get specific todo
- `PUT /api/{user_id}/tasks/{id}` - Update todo
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status
- `DELETE /api/{user_id}/tasks/{id}` - Delete todo

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost/dbname
NEON_DATABASE_URL=your_neon_db_url
SECRET_KEY=your_very_long_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000/api
```

## Running Tests

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Database Migrations

To create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:
```bash
cd backend
alembic upgrade head
```

## Development Workflow

1. Start backend: `cd backend && uvicorn main:app --reload`
2. In another terminal, start frontend: `cd frontend && npm run dev`
3. Access the application at `http://localhost:3000`

## Troubleshooting

- If you get database connection errors, verify your `DATABASE_URL` in the backend `.env` file
- If API calls fail from frontend, check that `NEXT_PUBLIC_BACKEND_API_URL` is set correctly
- Make sure the backend is running before starting the frontend
- For authentication issues, ensure JWT tokens are being properly stored in browser localStorage