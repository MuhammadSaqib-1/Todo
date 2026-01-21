"""
In-memory storage implementation for Todo items.
"""
from typing import Dict, List, Optional
from src.domain.todo import TodoItem


class InMemoryStore:
    """
    In-memory storage for Todo items using a dictionary.
    Provides O(1) lookup by ID and maintains uniqueness of IDs.
    """
    def __init__(self):
        """Initialize the in-memory store with an empty dictionary."""
        self.todos: Dict[int, TodoItem] = {}
        self._next_id = 1

    def create(self, todo: TodoItem) -> int:
        """
        Add a new TodoItem to the store with auto-generated ID.

        Args:
            todo: The TodoItem to add

        Returns:
            int: The ID of the created todo
        """
        # Auto-assign ID if not provided or is non-positive
        if todo.id <= 0:
            # Get the next available ID
            next_id = self.get_next_id()
            # Create a new TodoItem with the assigned ID
            todo = TodoItem(id=next_id, title=todo.title, completed=todo.completed)

        self.todos[todo.id] = todo
        return todo.id

    def read(self, todo_id: int) -> Optional[TodoItem]:
        """
        Retrieve a TodoItem by ID.

        Args:
            todo_id: The ID of the todo to retrieve

        Returns:
            TodoItem if found, None otherwise
        """
        return self.todos.get(todo_id)

    def update(self, todo_id: int, updated_todo: TodoItem) -> bool:
        """
        Update an existing TodoItem.

        Args:
            todo_id: The ID of the todo to update
            updated_todo: The updated TodoItem

        Returns:
            bool: True if update was successful, False if todo doesn't exist
        """
        if todo_id not in self.todos:
            return False

        self.todos[todo_id] = updated_todo
        return True

    def delete(self, todo_id: int) -> bool:
        """
        Remove a TodoItem by ID.

        Args:
            todo_id: The ID of the todo to delete

        Returns:
            bool: True if deletion was successful, False if todo doesn't exist
        """
        if todo_id not in self.todos:
            return False

        del self.todos[todo_id]
        return True

    def list_all(self) -> List[TodoItem]:
        """
        Return all TodoItems in the store.

        Returns:
            List of all TodoItem objects
        """
        return list(self.todos.values())

    def get_next_id(self) -> int:
        """
        Get the next available ID for a new todo.

        Returns:
            int: The next available ID
        """
        next_id = self._next_id
        while next_id in self.todos:
            next_id += 1
        return next_id