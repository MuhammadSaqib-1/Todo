"""
Unit tests for TodoService class.
"""
import pytest
from src.app.todo_service import TodoService
from src.storage.in_memory_store import InMemoryStore
from src.domain.todo import TodoItem


class TestTodoService:
    """Test cases for TodoService functionality."""

    def setup_method(self):
        """Set up a fresh service instance for each test."""
        self.store = InMemoryStore()
        self.service = TodoService(self.store)

    def test_add_todo_success(self):
        """Test adding a todo successfully."""
        title = "Test todo"
        todo_id = self.service.add_todo(title)

        # Verify the todo was created with an ID
        assert todo_id > 0

        # Verify the todo can be retrieved
        todo = self.service.get_todo(todo_id)
        assert todo is not None
        assert todo.id == todo_id
        assert todo.title == title
        assert todo.completed is False

    def test_add_todo_empty_title_fails(self):
        """Test that adding a todo with empty title raises ValueError."""
        with pytest.raises(ValueError):
            self.service.add_todo("")

    def test_add_todo_whitespace_only_title_fails(self):
        """Test that adding a todo with whitespace-only title raises ValueError."""
        with pytest.raises(ValueError):
            self.service.add_todo("   ")

    def test_add_todo_too_long_title_fails(self):
        """Test that adding a todo with title exceeding 500 chars raises ValueError."""
        long_title = "x" * 501
        with pytest.raises(ValueError):
            self.service.add_todo(long_title)

    def test_get_todo_exists(self):
        """Test retrieving an existing todo."""
        # Add a todo first
        title = "Test todo"
        todo_id = self.service.add_todo(title)

        # Retrieve the todo
        todo = self.service.get_todo(todo_id)

        assert todo is not None
        assert todo.id == todo_id
        assert todo.title == title
        assert todo.completed is False

    def test_get_todo_not_exists(self):
        """Test retrieving a non-existing todo returns None."""
        todo = self.service.get_todo(999)

        assert todo is None

    def test_get_all_todos_empty(self):
        """Test getting all todos when none exist."""
        todos = self.service.get_all_todos()

        assert len(todos) == 0

    def test_get_all_todos_multiple(self):
        """Test getting all todos when multiple exist."""
        # Add multiple todos
        title1 = "Test todo 1"
        title2 = "Test todo 2"
        title3 = "Test todo 3"

        id1 = self.service.add_todo(title1)
        id2 = self.service.add_todo(title2)
        id3 = self.service.add_todo(title3)

        # Get all todos
        todos = self.service.get_all_todos()

        assert len(todos) == 3

        # Verify all todos are present
        todo_ids = [todo.id for todo in todos]
        assert id1 in todo_ids
        assert id2 in todo_ids
        assert id3 in todo_ids

        # Verify titles are correct
        todo_titles = [todo.title for todo in todos]
        assert title1 in todo_titles
        assert title2 in todo_titles
        assert title3 in todo_titles

    def test_get_all_todos_contract(self):
        """Contract test for get_all_todos method - verify it returns a list of TodoItems."""
        # Add a few todos
        self.service.add_todo("Todo 1")
        self.service.add_todo("Todo 2")

        # Call get_all_todos
        todos = self.service.get_all_todos()

        # Verify return type and content
        assert isinstance(todos, list)
        assert len(todos) == 2
        # Verify all items are TodoItem instances
        from src.domain.todo import TodoItem
        for todo in todos:
            assert isinstance(todo, TodoItem)

    def test_update_todo_success(self):
        """Test updating a todo's title successfully."""
        # Add a todo first
        original_title = "Original title"
        new_title = "Updated title"
        todo_id = self.service.add_todo(original_title)

        # Update the todo
        success = self.service.update_todo(todo_id, new_title)

        assert success is True

        # Verify the update
        updated_todo = self.service.get_todo(todo_id)
        assert updated_todo is not None
        assert updated_todo.title == new_title

    def test_update_todo_not_exists(self):
        """Test updating a non-existing todo returns False."""
        success = self.service.update_todo(999, "New title")

        assert success is False

    def test_update_todo_contract(self):
        """Contract test for update_todo method - verify it returns boolean."""
        # Add a todo first
        todo_id = self.service.add_todo("Original title")

        # Update the todo and check return value
        result = self.service.update_todo(todo_id, "New title")
        assert isinstance(result, bool)
        assert result is True

        # Try to update non-existent todo and check return value
        result = self.service.update_todo(999, "Another title")
        assert isinstance(result, bool)
        assert result is False

    def test_update_todo_empty_title_fails(self):
        """Test that updating a todo with empty title raises ValueError."""
        # Add a todo first
        original_title = "Original title"
        todo_id = self.service.add_todo(original_title)

        # Try to update with empty title
        with pytest.raises(ValueError):
            self.service.update_todo(todo_id, "")

    def test_update_todo_too_long_title_fails(self):
        """Test that updating a todo with title exceeding 500 chars raises ValueError."""
        # Add a todo first
        original_title = "Original title"
        todo_id = self.service.add_todo(original_title)

        # Try to update with too long title
        long_title = "x" * 501
        with pytest.raises(ValueError):
            self.service.update_todo(todo_id, long_title)

    def test_mark_complete_success(self):
        """Test marking a todo as complete successfully."""
        # Add a todo first
        title = "Test todo"
        todo_id = self.service.add_todo(title)

        # Verify it starts as incomplete
        todo = self.service.get_todo(todo_id)
        assert todo.completed is False

        # Mark as complete
        success = self.service.mark_complete(todo_id, True)

        assert success is True

        # Verify it's now complete
        updated_todo = self.service.get_todo(todo_id)
        assert updated_todo.completed is True

    def test_mark_incomplete_success(self):
        """Test marking a todo as incomplete successfully."""
        # Add a todo first
        title = "Test todo"
        todo_id = self.service.add_todo(title)

        # Mark as complete first
        self.service.mark_complete(todo_id, True)

        # Verify it's complete
        todo = self.service.get_todo(todo_id)
        assert todo.completed is True

        # Mark as incomplete
        success = self.service.mark_complete(todo_id, False)

        assert success is True

        # Verify it's now incomplete
        updated_todo = self.service.get_todo(todo_id)
        assert updated_todo.completed is False

    def test_mark_complete_not_exists(self):
        """Test marking a non-existing todo returns False."""
        success = self.service.mark_complete(999, True)

        assert success is False

    def test_mark_complete_contract(self):
        """Contract test for mark_complete method - verify it returns boolean."""
        # Add a todo first
        todo_id = self.service.add_todo("Test todo")

        # Mark as complete and check return value
        result = self.service.mark_complete(todo_id, True)
        assert isinstance(result, bool)
        assert result is True

        # Mark as incomplete and check return value
        result = self.service.mark_complete(todo_id, False)
        assert isinstance(result, bool)
        assert result is True

        # Try to mark non-existent todo and check return value
        result = self.service.mark_complete(999, True)
        assert isinstance(result, bool)
        assert result is False

    def test_delete_todo_success(self):
        """Test deleting a todo successfully."""
        # Add a todo first
        title = "Test todo"
        todo_id = self.service.add_todo(title)

        # Verify it exists
        todo = self.service.get_todo(todo_id)
        assert todo is not None

        # Delete the todo
        success = self.service.delete_todo(todo_id)

        assert success is True

        # Verify it no longer exists
        deleted_todo = self.service.get_todo(todo_id)
        assert deleted_todo is None

    def test_delete_todo_not_exists(self):
        """Test deleting a non-existing todo returns False."""
        success = self.service.delete_todo(999)

        assert success is False

    def test_delete_todo_contract(self):
        """Contract test for delete_todo method - verify it returns boolean."""
        # Add a todo first
        todo_id = self.service.add_todo("Test todo for deletion")

        # Delete the todo and check return value
        result = self.service.delete_todo(todo_id)
        assert isinstance(result, bool)
        assert result is True

        # Try to delete non-existent todo and check return value
        result = self.service.delete_todo(999)
        assert isinstance(result, bool)
        assert result is False

    def test_delete_todo_edge_cases(self):
        """Test deletion edge cases."""
        # Add multiple todos
        id1 = self.service.add_todo("Todo 1")
        id2 = self.service.add_todo("Todo 2")
        id3 = self.service.add_todo("Todo 3")

        # Verify all exist
        todos = self.service.get_all_todos()
        assert len(todos) == 3

        # Delete one todo
        success = self.service.delete_todo(id2)
        assert success is True

        # Verify only 2 remain
        todos = self.service.get_all_todos()
        assert len(todos) == 2

        # Verify correct todo was deleted
        assert self.service.get_todo(id2) is None
        assert self.service.get_todo(id1) is not None
        assert self.service.get_todo(id3) is not None