from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from database.session import get_session
from models.todo import Todo, TodoCreate, TodoUpdate
from models.user import User
from schemas.todo import TodoResponse, TodoCreate as TodoCreateSchema, TodoUpdate as TodoUpdateSchema
from services.todo_service import (
    get_todos_by_user_id,
    get_todo_by_id_and_user,
    create_todo_for_user,
    update_todo,
    delete_todo,
    mark_todo_complete
)
from api.auth import oauth2_scheme, read_users_me

router = APIRouter()


def get_current_user_id(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> int:
    """Extract user ID from token."""
    from jose import jwt
    from jose.exceptions import JWTError
    from core.config import settings

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    from api.auth import get_user_by_email
    user = get_user_by_email(session, email=email)
    if user is None:
        raise credentials_exception

    return user.id


@router.get("/{user_id}/tasks", response_model=List[TodoResponse])
def get_tasks(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all tasks for a specific user."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )

    todos = get_todos_by_user_id(session, user_id, skip=skip, limit=limit)
    return todos


@router.post("/{user_id}/tasks", response_model=TodoResponse)
def create_task(
    user_id: int,
    todo: TodoCreateSchema,
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new task for a user."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    db_todo = create_todo_for_user(session, todo, user_id)
    return db_todo


@router.get("/{user_id}/tasks/{id}", response_model=TodoResponse)
def get_task(
    user_id: int,
    id: int,
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get a specific task by ID."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    db_todo = get_todo_by_id_and_user(session, id, user_id)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_todo


@router.put("/{user_id}/tasks/{id}", response_model=TodoResponse)
def update_task(
    user_id: int,
    id: int,
    todo_update: TodoUpdateSchema,
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update a specific task."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    db_todo = update_todo(session, id, todo_update, user_id)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_todo


@router.patch("/{user_id}/tasks/{id}/complete")
def complete_task(
    user_id: int,
    id: int,
    is_completed: bool = True,
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """Mark a task as complete or incomplete."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    db_todo = mark_todo_complete(session, id, user_id, is_completed)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated successfully"}


@router.delete("/{user_id}/tasks/{id}")
def delete_task(
    user_id: int,
    id: int,
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete a specific task."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    success = delete_todo(session, id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}