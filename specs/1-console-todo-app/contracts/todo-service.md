# Todo Service API Contract

## TodoService Interface

### Methods

#### add_todo(title: str) -> int
- **Purpose**: Add a new todo item
- **Input**: Todo title/description (string)
- **Output**: ID of the created todo (integer)
- **Errors**: ValueError if title is empty

#### get_todo(todo_id: int) -> TodoItem
- **Purpose**: Retrieve a specific todo item
- **Input**: Todo ID (integer)
- **Output**: TodoItem object
- **Errors**: KeyError if todo doesn't exist

#### get_all_todos() -> List[TodoItem]
- **Purpose**: Retrieve all todo items
- **Input**: None
- **Output**: List of all TodoItem objects
- **Errors**: None

#### update_todo(todo_id: int, title: str) -> bool
- **Purpose**: Update the title of a todo item
- **Input**: Todo ID (integer), new title (string)
- **Output**: Success status (boolean)
- **Errors**: KeyError if todo doesn't exist

#### mark_complete(todo_id: int, completed: bool) -> bool
- **Purpose**: Update the completion status of a todo item
- **Input**: Todo ID (integer), completion status (boolean)
- **Output**: Success status (boolean)
- **Errors**: KeyError if todo doesn't exist

#### delete_todo(todo_id: int) -> bool
- **Purpose**: Delete a todo item
- **Input**: Todo ID (integer)
- **Output**: Success status (boolean)
- **Errors**: KeyError if todo doesn't exist