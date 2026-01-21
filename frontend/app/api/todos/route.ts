import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// In-memory storage for demo purposes
const todos: any[] = [];
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

// Helper to verify token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function handleTodosRequest(request: NextRequest, method: string) {
  const url = new URL(request.url);
  const path = url.pathname;
  const segments = path.split('/').filter(segment => segment !== '');
  const apiIndex = segments.indexOf('api');
  const remainingSegments = segments.slice(apiIndex + 1);

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return Response.json({ detail: 'Authentication required' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return Response.json({ detail: 'Invalid token' }, { status: 401 });
  }

  if (method === 'GET') {
    // Handle GET /api/{userId}/tasks
    if (remainingSegments[1] === 'tasks' && remainingSegments[0]) {
      const userId = parseInt(remainingSegments[0]);

      if (decoded.user_id !== userId) {
        return Response.json({ detail: 'Not authorized' }, { status: 403 });
      }

      const userTodos = todos.filter(todo => todo.userId === userId);
      return Response.json(userTodos);
    }
    // Handle GET /api/{userId}/tasks/{id}
    else if (remainingSegments[1] === 'tasks' && remainingSegments[2]) {
      const userId = parseInt(remainingSegments[0]);
      const todoId = parseInt(remainingSegments[2]);

      if (decoded.user_id !== userId) {
        return Response.json({ detail: 'Not authorized' }, { status: 403 });
      }

      const todo = todos.find(t => t.id === todoId && t.userId === userId);
      if (!todo) {
        return Response.json({ detail: 'Task not found' }, { status: 404 });
      }

      return Response.json(todo);
    }
  } else if (method === 'POST') {
    // Handle POST /api/{userId}/tasks
    if (remainingSegments[1] === 'tasks' && remainingSegments[0]) {
      const userId = parseInt(remainingSegments[0]);

      if (decoded.user_id !== userId) {
        return Response.json({ detail: 'Not authorized' }, { status: 403 });
      }

      const { title, description, due_date, priority_level, category } = await request.json();

      const newTodo = {
        id: todos.length + 1,
        userId,
        title,
        description: description || '',
        is_completed: false,
        due_date,
        priority_level: priority_level || 'normal',
        category: category || 'General',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      todos.push(newTodo);

      return Response.json(newTodo, { status: 201 });
    }
  } else if (method === 'PUT') {
    // Handle PUT /api/{userId}/tasks/{id}
    if (remainingSegments[1] === 'tasks' && remainingSegments[2]) {
      const userId = parseInt(remainingSegments[0]);
      const todoId = parseInt(remainingSegments[2]);

      if (decoded.user_id !== userId) {
        return Response.json({ detail: 'Not authorized' }, { status: 403 });
      }

      const todoIndex = todos.findIndex(todo => todo.id === todoId && todo.userId === userId);
      if (todoIndex === -1) {
        return Response.json({ detail: 'Task not found' }, { status: 404 });
      }

      const { title, description, is_completed, due_date, priority_level, category } = await request.json();

      todos[todoIndex] = {
        ...todos[todoIndex],
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(is_completed !== undefined && { is_completed }),
        ...(due_date !== undefined && { due_date }),
        ...(priority_level !== undefined && { priority_level }),
        ...(category !== undefined && { category }),
        updated_at: new Date().toISOString()
      };

      return Response.json(todos[todoIndex]);
    }
  } else if (method === 'PATCH') {
    // Handle PATCH /api/{userId}/tasks/{id}/complete
    if (remainingSegments[1] === 'tasks' && remainingSegments[2] && remainingSegments[3] === 'complete') {
      const userId = parseInt(remainingSegments[0]);
      const todoId = parseInt(remainingSegments[2]);

      if (decoded.user_id !== userId) {
        return Response.json({ detail: 'Not authorized' }, { status: 403 });
      }

      const searchParams = url.searchParams;
      const isCompleted = searchParams.get('is_completed') === 'true';

      const todoIndex = todos.findIndex(todo => todo.id === todoId && todo.userId === userId);
      if (todoIndex === -1) {
        return Response.json({ detail: 'Task not found' }, { status: 404 });
      }

      todos[todoIndex] = {
        ...todos[todoIndex],
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      };

      return Response.json({ message: 'Task updated successfully' });
    }
  } else if (method === 'DELETE') {
    // Handle DELETE /api/{userId}/tasks/{id}
    if (remainingSegments[1] === 'tasks' && remainingSegments[2]) {
      const userId = parseInt(remainingSegments[0]);
      const todoId = parseInt(remainingSegments[2]);

      if (decoded.user_id !== userId) {
        return Response.json({ detail: 'Not authorized' }, { status: 403 });
      }

      const todoIndex = todos.findIndex(todo => todo.id === todoId && todo.userId === userId);
      if (todoIndex === -1) {
        return Response.json({ detail: 'Task not found' }, { status: 404 });
      }

      todos.splice(todoIndex, 1);
      return Response.json({ message: 'Task deleted successfully' });
    }
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}