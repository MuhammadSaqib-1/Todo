# Research: Todo Full-Stack Web Application

## Decision: Tech Stack Selection
**Rationale**: Selected Next.js for frontend and FastAPI for backend based on requirements for modern web application with strong type safety and API-first design. SQLModel chosen for data layer to provide both Pydantic validation and SQLAlchemy ORM capabilities.

**Alternatives considered**:
- React + Express: Less type safety and validation compared to Next.js + FastAPI
- Django: More heavyweight than needed for this application
- GraphQL vs REST: Chose REST as specified in requirements

## Decision: Authentication Method
**Rationale**: JWT-based authentication with password hashing using bcrypt. This provides stateless authentication suitable for API-first architecture with secure credential handling.

**Alternatives considered**:
- Session-based auth: More complex for API-first design
- OAuth providers: Not required by specifications
- Better Auth library: Considered but implementing custom JWT auth provides more control

## Decision: Database Schema Design
**Rationale**: Two main entities (User and Todo) with foreign key relationship to ensure data isolation between users. Proper indexing on user_id for efficient queries.

**Alternatives considered**:
- Single table with user_id: Would work but proper normalization is cleaner
- Different ORM: SQLAlchemy alone vs SQLModel - chose SQLModel for Pydantic integration

## Decision: API Endpoint Structure
**Rationale**: Following REST conventions with user-scoped endpoints as required by specifications: `/api/{user_id}/tasks`.

**Alternatives considered**:
- Global task endpoints with auth header: Less clear scoping
- Different URL patterns: Sticking to requirements

## Decision: Frontend State Management
**Rationale**: Using client-side state management with API calls for data persistence. Next.js App Router for navigation and page-level state.

**Alternatives considered**:
- Redux/Zustand: Overkill for this application size
- Client-side vs Server-side rendering: Chose App Router for flexibility