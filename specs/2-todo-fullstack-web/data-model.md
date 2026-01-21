# Data Model: Todo Full-Stack Web Application

## Entities

### User
Represents an authenticated user of the system, containing unique identifier, authentication details, and profile information.

**Fields**:
- `id` (int, primary key, auto-increment)
- `email` (string, unique, indexed, required)
- `username` (string, unique, indexed, required)
- `hashed_password` (string, required)
- `role` (enum: USER/ADMIN, default: USER)
- `is_active` (boolean, default: true)
- `created_at` (datetime, default: now)

**Relationships**:
- One-to-many with Todo (user "owns" multiple todos)

**Validation Rules**:
- Email must be valid email format
- Username must be unique
- Email must be unique
- Password must be hashed before storage

### Todo
Represents a task item owned by a specific user, containing title, description, completion status, creation timestamp, and user identifier relationship.

**Fields**:
- `id` (int, primary key, auto-increment)
- `title` (string, required)
- `description` (string, optional)
- `is_completed` (boolean, default: false)
- `user_id` (int, foreign key to User.id, required)
- `created_at` (datetime, default: now)
- `updated_at` (datetime, default: now, updates on change)

**Relationships**:
- Many-to-one with User (todo "belongs to" one user)

**Validation Rules**:
- Title must not be empty
- User_id must reference an existing user
- Only the owner can modify/delete the todo

## State Transitions

### Todo State Transitions
- `is_completed`: Can transition from false to true (mark complete) or true to false (mark incomplete)

## Database Schema

```sql
-- Users table
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_username ON user(username);

-- Todos table
CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Indexes for todos
CREATE INDEX idx_todo_user_id ON todo(user_id);
CREATE INDEX idx_todo_completed ON todo(is_completed);
```

## API Schema Objects

### User Schema
- `UserCreate`: email, username, password (plain text, will be hashed)
- `UserResponse`: id, email, username, is_active, created_at
- `UserUpdate`: email (optional), username (optional), password (optional)

### Todo Schema
- `TodoCreate`: title, description (optional)
- `TodoResponse`: id, title, description (optional), is_completed, user_id, created_at, updated_at
- `TodoUpdate`: title (optional), description (optional), is_completed (optional)