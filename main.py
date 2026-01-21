#!/usr/bin/env python3
"""
Entry point for the Phase I – In-Memory Console Todo App.

This application provides a command-line interface for managing todo items.
Features include adding, viewing, updating, marking complete, and deleting todos.
All data is stored in memory only and will be lost when the application exits.
"""

from src.cli.menu import TodoMenu
from src.app.todo_service import TodoService
from src.storage.in_memory_store import InMemoryStore


def main():
    """
    Main entry point for the Todo application.

    Initializes the storage, service, and CLI layers and starts the application.
    """
    # Initialize the storage layer
    store = InMemoryStore()

    # Initialize the service layer with the storage
    service = TodoService(store)

    # Initialize the CLI menu with the service
    menu = TodoMenu(service)

    # Run the application
    menu.run()


if __name__ == "__main__":
    main()