from sqlmodel import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

# Create the database engine
if settings.NEON_DATABASE_URL:
    engine = create_engine(settings.NEON_DATABASE_URL, connect_args={"sslmode": "require"})
else:
    engine = create_engine("sqlite:///./todo_app.db")  # Fallback for development

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()