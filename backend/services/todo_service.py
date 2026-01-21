from sqlmodel import Session, select
from typing import List, Optional
from models.todo import Todo, TodoCreate, TodoUpdate


def get_todos_by_user_id(session: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Todo]:
    """Get todos for a specific user."""
    statement = select(Todo).where(Todo.user_id == user_id).offset(skip).limit(limit)
    return session.execute(statement).scalars().all()


def get_todo_by_id_and_user(session: Session, todo_id: int, user_id: int) -> Optional[Todo]:
    """Get a specific todo by ID and user ID."""
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    return session.execute(statement).scalars().first()


def create_todo_for_user(session: Session, todo: TodoCreate, user_id: int) -> Todo:
    """Create a new todo for a user."""
    # Convert TodoCreate to dict and add the user_id
    todo_dict = todo.model_dump()
    todo_dict['user_id'] = user_id
    db_todo = Todo.model_validate(todo_dict)
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo


def update_todo(session: Session, todo_id: int, todo_update: TodoUpdate, user_id: int) -> Optional[Todo]:
    """Update a todo."""
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if db_todo:
        update_data = todo_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)

        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
    return db_todo


def delete_todo(session: Session, todo_id: int, user_id: int) -> bool:
    """Delete a todo."""
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if db_todo:
        session.delete(db_todo)
        session.commit()
        return True
    return False


def mark_todo_complete(session: Session, todo_id: int, user_id: int, is_completed: bool) -> Optional[Todo]:
    """Mark a todo as complete or incomplete."""
    db_todo = get_todo_by_id_and_user(session, todo_id, user_id)
    if db_todo:
        db_todo.is_completed = is_completed
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
    return db_todo