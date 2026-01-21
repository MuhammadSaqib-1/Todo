#!/usr/bin/env python3
"""
Test script to verify the complete workflow: add → view → mark complete → update → delete
"""
from src.cli.menu import TodoMenu
from src.app.todo_service import TodoService
from src.storage.in_memory_store import InMemoryStore


def test_complete_workflow():
    """Test the complete workflow: add -> view -> mark complete -> update -> delete"""
    print("Testing complete workflow: add -> view -> mark complete -> update -> delete")

    # Initialize the system
    store = InMemoryStore()
    service = TodoService(store)
    menu = TodoMenu(service)

    # Step 1: Add a todo
    print("\n1. Adding a todo...")
    todo_id = service.add_todo("Test todo for complete workflow")
    print(f"Added todo with ID: {todo_id}")

    # Step 2: View todos
    print("\n2. Viewing todos...")
    todos = service.get_all_todos()
    print(f"Found {len(todos)} todos:")
    for todo in todos:
        status = "X" if todo.completed else "O"
        print(f"  [{status}] ID: {todo.id} - {todo.title}")

    # Step 3: Mark as complete
    print(f"\n3. Marking todo {todo_id} as complete...")
    success = service.mark_complete(todo_id, True)
    print(f"Mark complete success: {success}")

    # Verify it's marked as complete
    updated_todo = service.get_todo(todo_id)
    print(f"Todo status after marking complete: {'X' if updated_todo.completed else 'O'}")

    # Step 4: Update the todo
    print(f"\n4. Updating todo {todo_id}...")
    success = service.update_todo(todo_id, "Updated test todo for complete workflow")
    print(f"Update success: {success}")

    # Verify the update
    updated_todo = service.get_todo(todo_id)
    print(f"Updated todo title: {updated_todo.title}")

    # Step 5: Delete the todo
    print(f"\n5. Deleting todo {todo_id}...")
    success = service.delete_todo(todo_id)
    print(f"Delete success: {success}")

    # Verify it's deleted
    deleted_todo = service.get_todo(todo_id)
    print(f"Todo after deletion (should be None): {deleted_todo}")

    # Final view to confirm deletion
    todos = service.get_all_todos()
    print(f"\nFinal todo count: {len(todos)} (should be 0)")

    print("\nV Complete workflow test passed!")


if __name__ == "__main__":
    test_complete_workflow()