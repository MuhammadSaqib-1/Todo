from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import datetime
from datetime import timezone
from .user import User


class TodoBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    due_date: Optional[datetime.datetime] = None
    priority_level: str = Field(default="normal", max_length=20)  # low, normal, high, urgent
    category: str = Field(default="General", max_length=50)  # Work, Personal, Shopping, etc.


class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Relationship to owner - exclude from response serialization
    owner: Optional[User] = Relationship(back_populates="todos", sa_relationship_kwargs={"lazy": "select"})


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    due_date: Optional[datetime.datetime] = None


class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime.datetime] = None
    priority_level: Optional[str] = None  # low, normal, high, urgent
    category: Optional[str] = None  # Work, Personal, Shopping, etc.