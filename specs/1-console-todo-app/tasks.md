---
description: "Task list for Phase I – In-Memory Console Todo App"
---

# Tasks: Phase I – In-Memory Console Todo App

**Input**: Design documents from `/specs/1-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks included as specified in feature requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow single project structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure with src/ and tests/ directories
- [X] T002 [P] Create __init__.py files in all directories: src/, src/cli/, src/app/, src/domain/, src/storage/, tests/, tests/unit/, tests/integration/, tests/cli/
- [X] T003 Create requirements.txt with pytest for testing framework
- [X] T004 Create pyproject.toml with project metadata and Python 3.13+ requirement

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create TodoItem class in src/domain/todo.py with id, title, completed attributes
- [X] T006 [P] Add validation methods to TodoItem class for title length and non-empty validation
- [X] T007 Create InMemoryStore class in src/storage/in_memory_store.py with todos dictionary
- [X] T008 [P] Implement create, read, update, delete, list_all methods in InMemoryStore
- [X] T009 Create TodoService class in src/app/todo_service.py with storage dependency
- [X] T010 [P] Implement service methods for add_todo, get_todo, get_all_todos in TodoService
- [X] T011 Implement remaining service methods: update_todo, mark_complete, delete_todo in TodoService
- [X] T012 Create menu system in src/cli/menu.py with basic structure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---
## Phase 3: User Story 1 - Add Todo Item (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new todo tasks to their list so they can keep track of what needs to be done.

**Independent Test**: The system can accept a new todo item via console input and display it in the list of todos.

### Tests for User Story 1 (Test tasks included) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US1] Contract test for add_todo method in tests/unit/test_todo_service.py
- [X] T014 [P] [US1] Test TodoItem validation in tests/unit/test_todo.py
- [X] T015 [P] [US1] Test InMemoryStore create operation in tests/unit/test_store.py

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement add_todo method in TodoService that validates and stores new todo
- [X] T017 [P] [US1] Implement CLI function to get todo input from user in src/cli/menu.py
- [X] T018 [US1] Add "Add Todo" option to main menu in src/cli/menu.py
- [X] T019 [US1] Connect CLI add function to TodoService in src/cli/menu.py
- [X] T020 [US1] Add error handling for empty titles in src/domain/todo.py
- [X] T021 [US1] Add logging for todo creation in TodoService

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---
## Phase 4: User Story 2 - View Todo List (Priority: P1)

**Goal**: Enable users to see all their current todo items to understand what tasks they need to complete.

**Independent Test**: The system can display all existing todo items in a readable format when requested.

### Tests for User Story 2 (Test tasks included) ⚠️

- [X] T022 [P] [US2] Contract test for get_all_todos method in tests/unit/test_todo_service.py
- [X] T023 [P] [US2] Test display formatting for empty todo list in tests/cli/test_menu.py
- [X] T024 [P] [US2] Test display formatting for multiple todos in tests/cli/test_menu.py

### Implementation for User Story 2

- [X] T025 [P] [US2] Implement view todos display formatting in src/cli/menu.py
- [X] T026 [US2] Add "View Todos" option to main menu in src/cli/menu.py
- [X] T027 [US2] Connect CLI view function to TodoService get_all_todos method
- [X] T028 [US2] Format output to distinguish completed from incomplete todos
- [X] T029 [US2] Handle empty todo list case with appropriate message

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---
## Phase 5: User Story 3 - Mark Todo as Complete (Priority: P2)

**Goal**: Enable users to mark a todo item as complete so they can track their progress and filter completed tasks.

**Independent Test**: The system can update a specific todo item's status to "complete" when requested by the user.

### Tests for User Story 3 (Test tasks included) ⚠️

- [X] T030 [P] [US3] Contract test for mark_complete method in tests/unit/test_todo_service.py
- [X] T031 [P] [US3] Test marking complete/incomplete transitions in tests/unit/test_todo.py

### Implementation for User Story 3

- [X] T032 [P] [US3] Implement mark complete/incomplete functionality in TodoService
- [X] T033 [US3] Add "Mark Todo Complete" option to main menu in src/cli/menu.py
- [X] T034 [US3] Create CLI function to select todo and mark status in src/cli/menu.py
- [X] T035 [US3] Add error handling for invalid todo IDs in mark complete operation

**Checkpoint**: User Stories 1, 2, and 3 should all work independently

---
## Phase 6: User Story 4 - Update Todo Description (Priority: P3)

**Goal**: Enable users to modify the description of an existing todo item when their requirements change.

**Independent Test**: The system can update the text description of a specific todo item when requested.

### Tests for User Story 4 (Test tasks included) ⚠️

- [X] T036 [P] [US4] Contract test for update_todo method in tests/unit/test_todo_service.py
- [X] T037 [P] [US4] Test validation of updated title in tests/unit/test_todo.py

### Implementation for User Story 4

- [X] T038 [P] [US4] Implement update todo functionality in TodoService
- [X] T039 [US4] Add "Update Todo" option to main menu in src/cli/menu.py
- [X] T040 [US4] Create CLI function to select todo and update description in src/cli/menu.py
- [X] T041 [US4] Add validation for updated title in update operation

**Checkpoint**: User Stories 1, 2, 3, and 4 should all work independently

---
## Phase 7: User Story 5 - Delete Todo Item (Priority: P3)

**Goal**: Enable users to remove a todo item when it's no longer needed or has been completed outside the system.

**Independent Test**: The system can remove a specific todo item from the list when requested.

### Tests for User Story 5 (Test tasks included) ⚠️

- [X] T042 [P] [US5] Contract test for delete_todo method in tests/unit/test_todo_service.py
- [X] T043 [P] [US5] Test deletion edge cases in tests/unit/test_todo_service.py

### Implementation for User Story 5

- [X] T044 [P] [US5] Implement delete todo functionality in TodoService
- [X] T045 [US5] Add "Delete Todo" option to main menu in src/cli/menu.py
- [X] T046 [US5] Create CLI function to select and delete todo in src/cli/menu.py
- [X] T047 [US5] Add confirmation prompt for delete operation in src/cli/menu.py

**Checkpoint**: All user stories should now be independently functional

---
## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T048 [P] Add comprehensive error handling throughout all layers
- [X] T049 [P] Add input validation for all user inputs
- [X] T050 Add proper exception handling and user-friendly error messages
- [X] T051 [P] Add logging for all operations in src/app/todo_service.py
- [X] T052 Add help/instructions to CLI menu system
- [X] T053 [P] Run all tests and fix any failures
- [X] T054 Add documentation comments to all classes and methods
- [X] T055 Create main.py entry point that initializes and runs the application
- [X] T056 Test complete workflow: add → view → mark complete → update → delete

---
## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - May integrate with other stories but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints/cli
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---
## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (tests requested):
T013 [P] [US1] Contract test for add_todo method in tests/unit/test_todo_service.py
T014 [P] [US1] Test TodoItem validation in tests/unit/test_todo.py
T015 [P] [US1] Test InMemoryStore create operation in tests/unit/test_store.py

# Launch all implementation for User Story 1 together:
T016 [P] [US1] Implement add_todo method in TodoService that validates and stores new todo
T017 [P] [US1] Implement CLI function to get todo input from user in src/cli/menu.py
```

---
## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---
## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence