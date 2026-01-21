# Data Model: Phase I – In-Memory Console Todo App

## TodoItem Entity

### Fields
- **id** (int): Unique identifier for the todo item
  - Auto-generated, sequential numbering
  - Required, immutable once created
- **title** (str): Description of the todo task
  - Required, max 500 characters
  - User-provided text
- **completed** (bool): Completion status of the todo
  - Default: False
  - Can be updated to True/False

### Validation Rules
- Title must not be empty or consist only of whitespace
- Title must not exceed 500 characters
- ID must be unique within the system
- ID must be a positive integer

### State Transitions
- Initial state: completed = False
- State can transition from False → True (mark as complete)
- State can transition from True → False (mark as incomplete)
- No other state transitions are valid

## In-Memory Store

### Structure
- **todos** (dict): Dictionary with ID as key and TodoItem as value
  - Provides O(1) lookup by ID
  - Maintains uniqueness of IDs
  - Stores all active todo items in memory

### Operations
- **create**: Add new TodoItem to the store with auto-generated ID
- **read**: Retrieve TodoItem by ID
- **update**: Modify existing TodoItem fields
- **delete**: Remove TodoItem by ID
- **list_all**: Return all TodoItems in the store