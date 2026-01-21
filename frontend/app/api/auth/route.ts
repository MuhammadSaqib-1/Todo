import { NextRequest } from 'next/server';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

// In-memory storage for demo purposes
// In production, use a proper database like Vercel Postgres or MongoDB
const users: any[] = [];
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

// Helper to verify token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function handleAuthRequest(request: NextRequest, method: string) {
  const url = new URL(request.url);
  const path = url.pathname;
  const segments = path.split('/').filter(segment => segment !== '');
  const apiIndex = segments.indexOf('api');
  const remainingSegments = segments.slice(apiIndex + 1);

  if (method === 'POST') {
    if (remainingSegments[0] === 'signup') {
      const { email, password, username } = await request.json();

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return Response.json({ detail: 'Email already registered' }, { status: 400 });
      }

      const hashedPassword = await hash(password, 10);
      const newUser = {
        id: users.length + 1,
        email,
        username,
        hashed_password: hashedPassword,
        created_at: new Date()
      };

      users.push(newUser);

      // Create JWT token
      const token = jwt.sign(
        { sub: newUser.email, user_id: newUser.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return Response.json({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        access_token: token,
        token_type: 'bearer'
      });
    } else if (remainingSegments[0] === 'login') {
      // Parse form data for login (since it's x-www-form-urlencoded)
      const formData = await request.formData();
      const email = formData.get('username') as string;
      const password = formData.get('password') as string;

      const user = users.find(u => u.email === email);

      if (!user || !await compare(password, user.hashed_password)) {
        return Response.json({ detail: 'Incorrect email or password' }, { status: 401 });
      }

      const token = jwt.sign(
        { sub: user.email, user_id: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return Response.json({
        access_token: token,
        token_type: 'bearer'
      });
    } else if (remainingSegments[0] === 'users' && remainingSegments[1] === 'change-password') {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return Response.json({ detail: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return Response.json({ detail: 'Invalid token' }, { status: 401 });
      }

      const { current_password, new_password } = await request.json();
      const user = users.find(u => u.id === decoded.user_id);

      if (!user || !await compare(current_password, user.hashed_password)) {
        return Response.json({ detail: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedNewPassword = await hash(new_password, 10);
      user.hashed_password = hashedNewPassword;

      return Response.json({ message: 'Password changed successfully' });
    }
  } else if (method === 'GET') {
    if (remainingSegments[0] === 'users' && remainingSegments[1] === 'me') {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return Response.json({ detail: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return Response.json({ detail: 'Invalid token' }, { status: 401 });
      }

      const user = users.find(u => u.id === decoded.user_id);
      if (!user) {
        return Response.json({ detail: 'User not found' }, { status: 404 });
      }

      return Response.json({
        id: user.id,
        email: user.email,
        username: user.username
      });
    }
  } else if (method === 'PUT') {
    if (remainingSegments[0] === 'users' && remainingSegments[1] === 'me') {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return Response.json({ detail: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return Response.json({ detail: 'Invalid token' }, { status: 401 });
      }

      const userData = await request.json();
      const user = users.find(u => u.id === decoded.user_id);

      if (!user) {
        return Response.json({ detail: 'User not found' }, { status: 404 });
      }

      // Update user data
      if (userData.email) user.email = userData.email;
      if (userData.username) user.username = userData.username;

      return Response.json({
        id: user.id,
        email: user.email,
        username: user.username
      });
    }
  }

  return Response.json({ error: 'Route not found' }, { status: 404 });
}