from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Todo API"
    API_VERSION: str = "v1"
    DATABASE_URL: Optional[str] = "sqlite:///./todo_app.db"
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    NEON_DATABASE_URL: Optional[str] = None  # Set this in your environment variables for production
    GOOGLE_API_KEY: str = "AIzaSyBHA_b-sMAnXa7p02hcPvirVKpOVkSedJshi"  # Google API key (for other services)


settings = Settings()