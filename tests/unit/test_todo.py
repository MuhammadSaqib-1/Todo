"""
Unit tests for TodoItem class.
"""
import pytest
from src.domain.todo import TodoItem


class TestTodoItem:
    """Test cases for TodoItem functionality."""

    def test_create_todo_item_valid(self):
        """Test creating a valid TodoItem."""
        todo = TodoItem(id=1, title="Test todo", completed=False)

        assert todo.id == 1
        assert todo.title == "Test todo"
        assert todo.completed is False

    def test_create_todo_item_defaults(self):
        """Test creating a TodoItem with default values."""
        todo = TodoItem(id=1, title="Test todo")

        assert todo.id == 1
        assert todo.title == "Test todo"
        assert todo.completed is False  # Should default to False

    def test_create_todo_item_completed_true(self):
        """Test creating a TodoItem with completed=True."""
        todo = TodoItem(id=1, title="Test todo", completed=True)

        assert todo.id == 1
        assert todo.title == "Test todo"
        assert todo.completed is True

    def test_create_todo_item_empty_title_fails(self):
        """Test creating a TodoItem with empty title raises ValueError."""
        with pytest.raises(ValueError):
            TodoItem(id=1, title="", completed=False)

    def test_create_todo_item_whitespace_only_title_fails(self):
        """Test creating a TodoItem with whitespace-only title raises ValueError."""
        with pytest.raises(ValueError):
            TodoItem(id=1, title="   ", completed=False)

    def test_create_todo_item_long_title_fails(self):
        """Test creating a TodoItem with title exceeding 500 chars raises ValueError."""
        long_title = "x" * 501
        with pytest.raises(ValueError):
            TodoItem(id=1, title=long_title, completed=False)

    def test_create_todo_item_zero_id_fails(self):
        """Test creating a TodoItem with ID 0 raises ValueError."""
        with pytest.raises(ValueError):
            TodoItem(id=0, title="Test todo", completed=False)

    def test_create_todo_item_negative_id_fails(self):
        """Test creating a TodoItem with negative ID raises ValueError."""
        with pytest.raises(ValueError):
            TodoItem(id=-1, title="Test todo", completed=False)

    def test_validate_title_valid(self):
        """Test validating a valid title returns True."""
        todo = TodoItem(id=1, title="Test todo", completed=False)

        result = todo.validate_title("Valid title")

        assert result is True

    def test_validate_title_empty_fails(self):
        """Test validating an empty title returns False."""
        todo = TodoItem(id=1, title="Test todo", completed=False)

        result = todo.validate_title("")

        assert result is False

    def test_validate_title_whitespace_only_fails(self):
        """Test validating a whitespace-only title returns False."""
        todo = TodoItem(id=1, title="Test todo", completed=False)

        result = todo.validate_title("   ")

        assert result is False

    def test_validate_title_too_long_fails(self):
        """Test validating a title exceeding 500 chars returns False."""
        todo = TodoItem(id=1, title="Test todo", completed=False)

        long_title = "x" * 501
        result = todo.validate_title(long_title)

        assert result is False

    def test_update_title_success(self):
        """Test updating title successfully."""
        todo = TodoItem(id=1, title="Original title", completed=False)

        todo.update_title("New title")

        assert todo.title == "New title"

    def test_update_title_empty_fails(self):
        """Test updating to empty title raises ValueError."""
        todo = TodoItem(id=1, title="Original title", completed=False)

        with pytest.raises(ValueError):
            todo.update_title("")

    def test_update_title_whitespace_only_fails(self):
        """Test updating to whitespace-only title raises ValueError."""
        todo = TodoItem(id=1, title="Original title", completed=False)

        with pytest.raises(ValueError):
            todo.update_title("   ")

    def test_update_title_too_long_fails(self):
        """Test updating to title exceeding 500 chars raises ValueError."""
        todo = TodoItem(id=1, title="Original title", completed=False)

        long_title = "x" * 501
        with pytest.raises(ValueError):
            todo.update_title(long_title)

    def test_update_title_validation_contract(self):
        """Test validation of updated title - verify validation methods work correctly."""
        todo = TodoItem(id=1, title="Original title", completed=False)

        # Valid title should pass validation
        assert todo.validate_title("Valid title") is True

        # Empty title should fail validation
        assert todo.validate_title("") is False

        # Whitespace-only title should fail validation
        assert todo.validate_title("   ") is False

        # Too long title should fail validation
        long_title = "x" * 501
        assert todo.validate_title(long_title) is False

    def test_mark_complete(self):
        """Test marking todo as complete."""
        todo = TodoItem(id=1, title="Test todo", completed=False)

        todo.mark_complete()

        assert todo.completed is True

    def test_mark_incomplete(self):
        """Test marking todo as incomplete."""
        todo = TodoItem(id=1, title="Test todo", completed=True)

        todo.mark_incomplete()

        assert todo.completed is False