import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const segments = path.split('/').filter(segment => segment !== '');

  // Extract the API endpoint (everything after /api/)
  const apiPath = path.replace('/api/', '').split('/')[0] || '';

  if (apiPath === 'health' || apiPath === '') {
    return Response.json({ status: 'healthy', message: 'API is running' });
  }

  // Delegate to appropriate handlers based on the API path
  if (apiPath.startsWith('auth') || apiPath === 'signup' || apiPath === 'login' || apiPath === 'users') {
    // Import and call auth handler
    const { handleAuthRequest } = await import('./auth/route');
    return handleAuthRequest(request, 'GET');
  } else if (apiPath.match(/^\d+\/tasks/) || apiPath === 'users') {
    // Import and call todos handler
    const { handleTodosRequest } = await import('./todos/route');
    return handleTodosRequest(request, 'GET');
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const apiPath = path.replace('/api/', '').split('/')[0] || '';

  // Delegate to appropriate handlers based on the API path
  if (apiPath === 'signup' || apiPath === 'login') {
    // Import and call auth handler
    const { handleAuthRequest } = await import('./auth/route');
    return handleAuthRequest(request, 'POST');
  } else if (apiPath.match(/^\d+\/tasks/)) {
    // Import and call todos handler
    const { handleTodosRequest } = await import('./todos/route');
    return handleTodosRequest(request, 'POST');
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const apiPath = path.replace('/api/', '').split('/')[0] || '';

  // Delegate to appropriate handlers based on the API path
  if (apiPath === 'users') {
    // Import and call auth handler for user updates
    const { handleAuthRequest } = await import('./auth/route');
    return handleAuthRequest(request, 'PUT');
  } else if (apiPath.match(/^\d+\/tasks\/\d+/)) {
    // Import and call todos handler for updates
    const { handleTodosRequest } = await import('./todos/route');
    return handleTodosRequest(request, 'PUT');
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const apiPath = path.replace('/api/', '').split('/')[0] || '';

  // Delegate to appropriate handlers based on the API path
  if (apiPath.match(/^\d+\/tasks\/\d+\/complete/)) {
    // Import and call todos handler for toggling completion
    const { handleTodosRequest } = await import('./todos/route');
    return handleTodosRequest(request, 'PATCH');
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const apiPath = path.replace('/api/', '').split('/')[0] || '';

  // Delegate to appropriate handlers based on the API path
  if (apiPath.match(/^\d+\/tasks\/\d+/)) {
    // Import and call todos handler for deletion
    const { handleTodosRequest } = await import('./todos/route');
    return handleTodosRequest(request, 'DELETE');
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}