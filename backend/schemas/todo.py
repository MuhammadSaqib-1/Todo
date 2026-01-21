from pydantic import BaseModel
from typing import Optional
import datetime


class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    user_id: int
    due_date: Optional[datetime.datetime] = None
    priority_level: str = "normal"  # low, normal, high, urgent
    category: str = "General"  # Work, Personal, Shopping, etc.


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    due_date: Optional[datetime.datetime] = None
    priority_level: str = "normal"  # low, normal, high, urgent
    category: str = "General"  # Work, Personal, Shopping, etc.
    # user_id is derived from the authenticated user, not from request body


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime.datetime] = None
    priority_level: Optional[str] = None  # low, normal, high, urgent
    category: Optional[str] = None  # Work, Personal, Shopping, etc.


class TodoResponse(TodoBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


class TodoListResponse(BaseModel):
    todos: list[TodoResponse]
    total_count: int