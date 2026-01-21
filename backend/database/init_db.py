from sqlmodel import SQLModel
from database.session import engine
from models.user import User
from models.todo import Todo
from sqlalchemy.exc import SQLAlchemyError


def create_db_and_tables():
    """Create database tables."""
    try:
        SQLModel.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except SQLAlchemyError as e:
        print(f"Error creating database tables: {e}")
        raise