# Quickstart: Phase I – In-Memory Console Todo App

## Prerequisites
- Python 3.13 or higher
- UV package manager

## Setup
1. Clone or create the project directory
2. Navigate to the project root
3. Install dependencies (if any) using UV:
   ```bash
   uv sync  # or uv pip install -r requirements.txt if using requirements file
   ```

## Running the Application
1. Execute the main application:
   ```bash
   python src/main.py
   ```

2. The console menu will appear with options to:
   - Add a new todo
   - View all todos
   - Update a todo
   - Mark a todo as complete/incomplete
   - Delete a todo
   - Exit the application

## Usage Examples
- To add a todo: Select option 1, then enter the todo description
- To view todos: Select option 2 to see all todos with their status
- To mark complete: Select option 3, enter todo ID, confirm completion
- To update: Select option 4, enter todo ID and new description
- To delete: Select option 5, enter todo ID to remove

## Development
- Run tests: `pytest tests/`
- The application follows a clean architecture with separation of CLI, application, domain, and storage layers
- All data is stored in memory only and will be lost when the application exits