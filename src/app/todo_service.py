"""
Todo service layer that orchestrates business logic for todo operations.
"""
import logging
from typing import List, Optional
from src.domain.todo import TodoItem
from src.storage.in_memory_store import InMemoryStore


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TodoService:
    """
    Service layer for todo operations that orchestrates domain logic and storage.
    """
    def __init__(self, store: InMemoryStore):
        """
        Initialize the TodoService with a storage instance.

        Args:
            store: The storage instance to use for data persistence
        """
        self.store = store

    def add_todo(self, title: str) -> int:
        """
        Add a new todo item after validating the title.

        Args:
            title: The title of the new todo

        Returns:
            int: The ID of the created todo

        Raises:
            ValueError: If the title is invalid
        """
        logger.info(f"Adding new todo with title: {title}")

        # Validate the title
        if not title or not title.strip():
            logger.error("Invalid title: empty or whitespace only")
            raise ValueError("Todo title cannot be empty or whitespace only")
        if len(title) > 500:
            logger.error(f"Invalid title: exceeds 500 characters (length: {len(title)})")
            raise ValueError("Todo title cannot exceed 500 characters")

        # Create a new TodoItem with the next available ID
        next_id = self.store.get_next_id()
        todo = TodoItem(id=next_id, title=title.strip(), completed=False)

        # Store the todo and return its ID
        todo_id = self.store.create(todo)
        logger.info(f"Successfully added todo with ID: {todo_id}")
        return todo_id

    def get_todo(self, todo_id: int) -> Optional[TodoItem]:
        """
        Retrieve a specific todo by ID.

        Args:
            todo_id: The ID of the todo to retrieve

        Returns:
            TodoItem if found, None otherwise
        """
        return self.store.read(todo_id)

    def get_all_todos(self) -> List[TodoItem]:
        """
        Retrieve all todos.

        Returns:
            List of all TodoItem objects
        """
        return self.store.list_all()

    def update_todo(self, todo_id: int, title: str) -> bool:
        """
        Update the title of an existing todo.

        Args:
            todo_id: The ID of the todo to update
            title: The new title

        Returns:
            bool: True if update was successful, False if todo doesn't exist
        """
        # Validate the new title
        if not title or not title.strip():
            raise ValueError("Todo title cannot be empty or whitespace only")
        if len(title) > 500:
            raise ValueError("Todo title cannot exceed 500 characters")

        # Get the existing todo
        existing_todo = self.store.read(todo_id)
        if not existing_todo:
            return False

        # Update the title
        existing_todo.update_title(title)

        # Update in storage
        return self.store.update(todo_id, existing_todo)

    def mark_complete(self, todo_id: int, completed: bool = True) -> bool:
        """
        Update the completion status of a todo.

        Args:
            todo_id: The ID of the todo to update
            completed: The new completion status (default True)

        Returns:
            bool: True if update was successful, False if todo doesn't exist
        """
        # Get the existing todo
        existing_todo = self.store.read(todo_id)
        if not existing_todo:
            return False

        # Update the completion status
        if completed:
            existing_todo.mark_complete()
        else:
            existing_todo.mark_incomplete()

        # Update in storage
        return self.store.update(todo_id, existing_todo)

    def delete_todo(self, todo_id: int) -> bool:
        """
        Delete a todo by ID.

        Args:
            todo_id: The ID of the todo to delete

        Returns:
            bool: True if deletion was successful, False if todo doesn't exist
        """
        return self.store.delete(todo_id)