"""
Console menu system for the Todo application.
"""
from typing import Optional
from src.app.todo_service import TodoService
from src.domain.todo import TodoItem


class TodoMenu:
    """
    CLI menu system that handles user interaction with the Todo application.
    """
    def __init__(self, todo_service: TodoService):
        """
        Initialize the menu with a TodoService instance.

        Args:
            todo_service: The service to handle todo operations
        """
        self.todo_service = todo_service

    def display_menu(self) -> None:
        """Display the main menu options to the user."""
        print("\n=== Todo App Menu ===")
        print("1. Add Todo")
        print("2. View Todos")
        print("3. Mark Todo Complete")
        print("4. Update Todo")
        print("5. Delete Todo")
        print("6. Help")
        print("7. Exit")
        print("=====================")

    def display_help(self) -> None:
        """Display help/instructions to the user."""
        print("\n=== Todo App Help ===")
        print("This application helps you manage your tasks.")
        print("\nOptions:")
        print("  1. Add Todo: Create a new todo item")
        print("  2. View Todos: See all your current todo items")
        print("  3. Mark Todo Complete: Update the status of a todo item")
        print("  4. Update Todo: Change the description of an existing todo")
        print("  5. Delete Todo: Remove a todo item from your list")
        print("  6. Help: Show this help message")
        print("  7. Exit: Quit the application")
        print("\nTips:")
        print("- Each todo has a unique ID that's shown when you view your todos")
        print("- You'll need the ID to update, mark complete, or delete a todo")
        print("- Completed todos are marked with ✓, incomplete with ○")
        print("=====================")

    def get_user_choice(self) -> str:
        """
        Get the user's menu choice.

        Returns:
            str: The user's menu choice
        """
        return input("Enter your choice (1-6): ").strip()

    def add_todo(self) -> None:
        """Handle adding a new todo item."""
        try:
            title = input("Enter todo description: ").strip()
            if not title:
                print("Error: Todo description cannot be empty.")
                return

            todo_id = self.todo_service.add_todo(title)
            print(f"Todo added successfully with ID: {todo_id}")
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error adding todo: {e}")

    def view_todos(self) -> None:
        """Handle viewing all todo items."""
        todos = self.todo_service.get_all_todos()

        if not todos:
            print("\nNo todos found.")
            return

        print("\n--- Todo List ---")
        for todo in todos:
            status = "✓" if todo.completed else "○"
            print(f"[{status}] ID: {todo.id} - {todo.title}")
        print("-----------------")

    def mark_complete(self) -> None:
        """Handle marking a todo as complete or incomplete."""
        try:
            todo_id = int(input("Enter the ID of the todo to mark: "))
            current_todo = self.todo_service.get_todo(todo_id)

            if not current_todo:
                print(f"Error: Todo with ID {todo_id} not found.")
                return

            # Ask user if they want to mark complete or incomplete
            action = input(f"Mark '{current_todo.title}' as (c)omplete or (i)ncomplete? [c/i]: ").strip().lower()
            if action in ['c', 'complete']:
                success = self.todo_service.mark_complete(todo_id, True)
                if success:
                    print(f"Todo '{current_todo.title}' marked as complete.")
                else:
                    print("Failed to update todo status.")
            elif action in ['i', 'incomplete']:
                success = self.todo_service.mark_complete(todo_id, False)
                if success:
                    print(f"Todo '{current_todo.title}' marked as incomplete.")
                else:
                    print("Failed to update todo status.")
            else:
                print("Invalid choice. Please enter 'c' for complete or 'i' for incomplete.")
        except ValueError:
            print("Error: Please enter a valid todo ID (number).")
        except Exception as e:
            print(f"Unexpected error marking todo: {e}")

    def update_todo(self) -> None:
        """Handle updating a todo's description."""
        try:
            todo_id = int(input("Enter the ID of the todo to update: "))
            current_todo = self.todo_service.get_todo(todo_id)

            if not current_todo:
                print(f"Error: Todo with ID {todo_id} not found.")
                return

            new_title = input(f"Enter new description for '{current_todo.title}': ").strip()
            if not new_title:
                print("Error: Todo description cannot be empty.")
                return

            success = self.todo_service.update_todo(todo_id, new_title)
            if success:
                print(f"Todo updated successfully.")
            else:
                print("Failed to update todo.")
        except ValueError as e:
            if "invalid literal" in str(e):
                print("Error: Please enter a valid todo ID (number).")
            else:
                print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error updating todo: {e}")

    def delete_todo(self) -> None:
        """Handle deleting a todo item."""
        try:
            todo_id = int(input("Enter the ID of the todo to delete: "))
            current_todo = self.todo_service.get_todo(todo_id)

            if not current_todo:
                print(f"Error: Todo with ID {todo_id} not found.")
                return

            # Confirm deletion
            confirm = input(f"Are you sure you want to delete '{current_todo.title}'? (y/n): ").strip().lower()
            if confirm in ['y', 'yes']:
                success = self.todo_service.delete_todo(todo_id)
                if success:
                    print("Todo deleted successfully.")
                else:
                    print("Failed to delete todo.")
            else:
                print("Deletion cancelled.")
        except ValueError:
            print("Error: Please enter a valid todo ID (number).")
        except Exception as e:
            print(f"Unexpected error deleting todo: {e}")

    def run(self) -> None:
        """Run the main application loop."""
        print("Welcome to the Todo App!")
        while True:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == '1':
                self.add_todo()
            elif choice == '2':
                self.view_todos()
            elif choice == '3':
                self.mark_complete()
            elif choice == '4':
                self.update_todo()
            elif choice == '5':
                self.delete_todo()
            elif choice == '6':
                self.display_help()
            elif choice == '7':
                print("Thank you for using the Todo App!")
                break
            else:
                print("Invalid choice. Please enter a number between 1-7.")