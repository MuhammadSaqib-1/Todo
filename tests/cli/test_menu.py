"""
CLI tests for the Todo application menu system.
"""
import pytest
from unittest.mock import Mock, patch
from src.cli.menu import TodoMenu
from src.app.todo_service import TodoService
from src.storage.in_memory_store import InMemoryStore
from src.domain.todo import TodoItem


class TestTodoMenu:
    """Test cases for TodoMenu functionality."""

    def setup_method(self):
        """Set up a fresh menu instance for each test."""
        self.store = InMemoryStore()
        self.service = TodoService(self.store)
        self.menu = TodoMenu(self.service)

    def test_display_menu(self, capsys):
        """Test that the menu displays correctly."""
        self.menu.display_menu()
        captured = capsys.readouterr()

        # Check that menu options are displayed
        output = captured.out
        assert "Todo App Menu" in output
        assert "1. Add Todo" in output
        assert "2. View Todos" in output
        assert "3. Mark Todo Complete" in output
        assert "4. Update Todo" in output
        assert "5. Delete Todo" in output
        assert "6. Help" in output
        assert "7. Exit" in output

    def test_get_user_choice(self):
        """Test getting user choice (this would require input mocking)."""
        # This test is more complex as it requires mocking user input
        pass

    def test_add_todo(self):
        """Test adding a todo through the menu."""
        # This would require mocking user input
        with patch('builtins.input', side_effect=['Test todo from menu']):
            # Capture print statements
            with patch('builtins.print') as mock_print:
                self.menu.add_todo()

                # Check that the success message was printed
                mock_print.assert_called()

        # Verify the todo was actually added to the service
        todos = self.service.get_all_todos()
        assert len(todos) == 1
        assert todos[0].title == "Test todo from menu"

    def test_add_todo_empty_input(self):
        """Test adding a todo with empty input shows error."""
        with patch('builtins.input', side_effect=['']):
            with patch('builtins.print') as mock_print:
                self.menu.add_todo()

                # Check that an error message was printed
                error_called = any('Error' in str(call) for call in mock_print.call_args_list if call[0])
                assert error_called

    def test_view_todos_empty(self, capsys):
        """Test viewing todos when none exist."""
        self.menu.view_todos()
        captured = capsys.readouterr()

        # Check that appropriate message is shown
        assert "No todos found" in captured.out

    def test_view_todos_with_items(self, capsys):
        """Test viewing todos when items exist."""
        # Add some todos first
        todo_id1 = self.service.add_todo("Todo 1")
        todo_id2 = self.service.add_todo("Todo 2")
        self.service.mark_complete(todo_id1, True)  # Mark first as complete

        self.menu.view_todos()
        captured = capsys.readouterr()

        # Check that todos are displayed
        output = captured.out
        assert "Todo 1" in output
        assert "Todo 2" in output
        assert "✓" in output  # Complete marker for first todo
        assert "○" in output  # Incomplete marker for second todo

    def test_mark_complete(self):
        """Test marking a todo as complete."""
        # Add a todo first
        todo_id = self.service.add_todo("Test todo for completion")

        # Mock user input: todo ID, then 'c' for complete
        with patch('builtins.input', side_effect=[str(todo_id), 'c']):
            with patch('builtins.print'):
                self.menu.mark_complete()

        # Verify the todo is now complete
        todo = self.service.get_todo(todo_id)
        assert todo is not None
        assert todo.completed is True

    def test_mark_incomplete(self):
        """Test marking a todo as incomplete."""
        # Add a todo first and mark it complete
        todo_id = self.service.add_todo("Test todo for completion")
        self.service.mark_complete(todo_id, True)

        # Verify it's complete
        todo = self.service.get_todo(todo_id)
        assert todo.completed is True

        # Mock user input: todo ID, then 'i' for incomplete
        with patch('builtins.input', side_effect=[str(todo_id), 'i']):
            with patch('builtins.print'):
                self.menu.mark_complete()

        # Verify the todo is now incomplete
        todo = self.service.get_todo(todo_id)
        assert todo is not None
        assert todo.completed is False

    def test_update_todo(self):
        """Test updating a todo's title."""
        # Add a todo first
        todo_id = self.service.add_todo("Original title")

        # Mock user input: todo ID, new title
        new_title = "Updated title"
        with patch('builtins.input', side_effect=[str(todo_id), new_title]):
            with patch('builtins.print'):
                self.menu.update_todo()

        # Verify the todo title was updated
        todo = self.service.get_todo(todo_id)
        assert todo is not None
        assert todo.title == new_title

    def test_delete_todo(self):
        """Test deleting a todo."""
        # Add a todo first
        todo_id = self.service.add_todo("Test todo for deletion")

        # Verify it exists
        todo = self.service.get_todo(todo_id)
        assert todo is not None

        # Mock user input: todo ID, then 'y' to confirm deletion
        with patch('builtins.input', side_effect=[str(todo_id), 'y']):
            with patch('builtins.print'):
                self.menu.delete_todo()

        # Verify the todo no longer exists
        todo = self.service.get_todo(todo_id)
        assert todo is None