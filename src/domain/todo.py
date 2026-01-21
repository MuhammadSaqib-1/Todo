"""
TodoItem domain entity representing a single todo task.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class TodoItem:
    """
    Represents a single todo item with id, title, and completion status.
    """
    id: int
    title: str
    completed: bool = False

    def __post_init__(self):
        """Validate the TodoItem after initialization."""
        if not self.title or not self.title.strip():
            raise ValueError("Todo title cannot be empty or whitespace only")
        if len(self.title) > 500:
            raise ValueError("Todo title cannot exceed 500 characters")
        if self.id <= 0:
            raise ValueError("Todo ID must be a positive integer")

    def validate_title(self, title: str) -> bool:
        """
        Validate a title string according to business rules.

        Args:
            title: The title to validate

        Returns:
            bool: True if valid, False otherwise
        """
        if not title or not title.strip():
            return False
        if len(title) > 500:
            return False
        return True

    def update_title(self, new_title: str) -> None:
        """
        Update the title of the todo item after validation.

        Args:
            new_title: The new title for the todo
        """
        if not self.validate_title(new_title):
            raise ValueError("Invalid title provided")
        self.title = new_title.strip()

    def mark_complete(self) -> None:
        """Mark the todo as complete."""
        self.completed = True

    def mark_incomplete(self) -> None:
        """Mark the todo as incomplete."""
        self.completed = False