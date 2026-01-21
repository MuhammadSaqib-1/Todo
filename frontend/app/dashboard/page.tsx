'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { todoAPI, authAPI } from '../../lib/api';
import { Todo } from './types';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newPriority, setNewPriority] = useState<string>('normal');
  const [newCategory, setNewCategory] = useState<string>('General');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [editPriority, setEditPriority] = useState<string>('normal');
  const [editCategory, setEditCategory] = useState<string>('General');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Sort by creation date
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); // Filter by category
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const router = useRouter();

  // Get user ID from localStorage (in a real app, you'd decode the JWT)
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/signin');
      return;
    }

    // Check if we have the user ID stored
    const storedUserId = parseInt(localStorage.getItem('user_id') || '0');
    console.log('Stored userId:', storedUserId);
    if (storedUserId > 0) {
      setUserId(storedUserId);
    } else {
      // If no user ID is stored, fetch user profile to get it
      const fetchUserProfile = async () => {
        try {
          const response = await authAPI.getCurrentUser();
          console.log('Current user response:', response.data);
          const fetchedUserId = response.data.id;

          // Validate that the fetched user ID is a valid number
          if (typeof fetchedUserId === 'number' && fetchedUserId > 0) {
            localStorage.setItem('user_id', fetchedUserId.toString());
            setUserId(fetchedUserId);
          } else {
            throw new Error('Invalid user ID received from server');
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);

          // Instead of immediately redirecting, let the user stay on the page
          // The user might be able to continue working with their todos if the backend is temporarily down
          setError('Warning: Could not fetch user profile. Some features may be limited.');

          // Try to use a default user ID if available in token (decode JWT if possible)
          const token = localStorage.getItem('access_token');
          if (token) {
            try {
              // Check if we're in a browser environment
              if (typeof atob !== 'undefined') {
                // Try to decode JWT to get user ID
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);

                // Extract user ID from token payload - prefer user_id field if available, otherwise derive from sub
                let userIdFromToken = decodedToken.user_id || decodedToken.userId;
                if (!userIdFromToken) {
                  // Extract from email or use a default
                  userIdFromToken = parseInt(decodedToken.sub?.split('@')[0]?.replace(/\D/g, '') || '1') || 1;
                }

                // Ensure the derived ID is valid
                if (typeof userIdFromToken === 'number' && userIdFromToken > 0) {
                  setUserId(userIdFromToken);
                  localStorage.setItem('user_id', userIdFromToken.toString());
                } else {
                  // Use a default ID if the derived ID is invalid
                  setUserId(1);
                  localStorage.setItem('user_id', '1');
                }
              } else {
                // If atob is not available (should be in browsers), use a default
                setUserId(1);
                localStorage.setItem('user_id', '1');
              }
            } catch (decodeErr) {
              console.warn('Could not decode token to get user ID, using default ID 1');
              setUserId(1);
              localStorage.setItem('user_id', '1');
            }
          } else {
            // If no token, redirect to sign in
            setError('Authentication error. Please log in again.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            router.push('/signin');
          }
        }
      };

      fetchUserProfile();
    }
  }, []);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (userId) {
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    if (userId) {
      fetchCurrentUser();
    }
  }, [userId]);

  // Fetch todos when userId changes
  useEffect(() => {
    console.log('UserId changed:', userId);
    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  // Get unique categories from todos
  const categories = Array.from(new Set(todos.map(todo => todo.category)));

  // Sort and filter todos
  const getSortedFilteredTodos = () => {
    let filteredTodos = [...todos];

    // Apply filter
    if (filter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.is_completed);
    } else if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.is_completed);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.category === categoryFilter);
    }

    // Sort by creation date
    filteredTodos.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filteredTodos;
  };

  // Function to format time as relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 30) {
      return 'Just now';
    } else if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  // Safe error setter to prevent [object Object] issues and handle network errors
  const safeSetError = (err: any) => {
    console.error('Error details:', err); // Log for debugging

    if (typeof err === 'string') {
      setError(err);
    } else if (err && typeof err === 'object') {
      // Check for network errors
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else if (err.response?.status === 0) {
        setError('Network error: Unable to reach the server. Please check if the backend is running.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } else {
      setError('An error occurred. Please try again.');
    }
  };

  const fetchTodos = async () => {
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching todos for userId:', userId);
      const response = await todoAPI.getTodos(userId);
      console.log('API response:', response.data);

      // The API returns the array directly, not wrapped in a 'todos' property
      const todosArray = Array.isArray(response.data) ? response.data : response.data.todos || [];
      console.log('Parsed todos array:', todosArray);
      setTodos(todosArray);
    } catch (err) {
      console.error('Error fetching todos:', err);
      safeSetError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    if (!newTodo.trim()) return;

    try {
      const response = await todoAPI.createTodo(userId, {
        title: newTodo,
        description: newDescription,
        due_date: newDueDate ? new Date(newDueDate).toISOString() : undefined,
        priority_level: newPriority,
        category: newCategory
      });

      // Clear the form
      setNewTodo('');
      setNewDescription('');
      setNewDueDate('');
      setNewPriority('normal');
      setNewCategory('General');

      // Hide the form after successful submission
      setShowAddForm(false);

      // Refresh the todos to include the new one and wait for completion
      await fetchTodos();

      // Show success message with tick icon
      setError('✓ Task created successfully!');
      setTimeout(() => setError(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      safeSetError(err);
      console.error(err);
    }
  };

  const handleToggleComplete = async (id: number, isCompleted: boolean) => {
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await todoAPI.toggleComplete(userId, id, !isCompleted);
      await fetchTodos(); // Refresh the list
    } catch (err) {
      safeSetError(err);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await todoAPI.deleteTodo(userId, id);
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.due_date || '');
    setEditPriority(todo.priority_level);
    setEditCategory(todo.category);
  };

  const saveEdit = async (id: number) => {
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await todoAPI.updateTodo(userId, id, {
        title: editText,
        description: editDescription,
        due_date: editDueDate ? new Date(editDueDate).toISOString() : undefined,
        priority_level: editPriority,
        category: editCategory,
        is_completed: false // We don't change completion status here
      });
      setEditingId(null);
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Count todos based on filters
  const completedCount = todos.filter(todo => todo.is_completed).length;
  const activeCount = todos.length - completedCount;
  const filteredTodos = getSortedFilteredTodos();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });

      // Reset form and close modal
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordError('');
      setShowPasswordModal(false);

      // Show success message with tick icon
      setError('✓ Password changed successfully!');
      setTimeout(() => setError(''), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      console.error('Password change error:', err);
      if (err.response?.data?.detail) {
        setPasswordError(err.response.data.detail);
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>

            {passwordError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0 pt-0.5">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      {passwordError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-indigo-600">Todo Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {activeCount} active, {completedCount} completed
              </span>
              {currentUser && (
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Welcome, {currentUser.username}!</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('user_id');
                  router.push('/signin');
                }}
                className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{todos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-semibold text-gray-900">{todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className={`mb-6 p-4 rounded-xl shadow-md ${
            error.startsWith('✓')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : error.toLowerCase().includes('success')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {error.startsWith('✓') || error.toLowerCase().includes('success') ? (
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Todo Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Task</h2>

          {/* Button to show form */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {showAddForm ? 'Cancel' : 'Add Task'}
            </button>
          </div>

          {/* Form that shows when button is clicked */}
          {showAddForm && (
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Add details about this task..."
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  id="priority"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Create Task
              </button>
            </form>
          )}
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>

            <div className="flex flex-wrap gap-3">
              {/* Status Filters */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    filter === 'all'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All ({todos.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    filter === 'active'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    filter === 'completed'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                {sortOrder === 'desc' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Newest
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Oldest
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  {filter === 'completed'
                    ? "You haven't completed any tasks yet."
                    : filter === 'active'
                      ? "All tasks are completed! Add a new task or check back later."
                      : "Get started by adding a new task using the form above."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className="px-6 py-5 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0">
                    {editingId === todo.id ? (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          autoFocus
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="General">General</option>
                          <option value="Work">Work</option>
                          <option value="Personal">Personal</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Health">Health</option>
                          <option value="Finance">Finance</option>
                          <option value="Education">Education</option>
                        </select>
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                          >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                          >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between group">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              checked={todo.is_completed}
                              onChange={() => handleToggleComplete(todo.id, todo.is_completed)}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full transition-all duration-200"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-base font-semibold ${
                                todo.is_completed ? 'line-through text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {todo.title}
                            </p>
                            {todo.description && (
                              <p className={`text-sm mt-1 ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                {todo.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {todo.due_date && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  new Date(todo.due_date) < new Date() && !todo.is_completed
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                  <svg className="-ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(todo.due_date).toLocaleDateString()}
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                todo.priority_level === 'low' ? 'bg-green-100 text-green-800 border border-green-200' :
                                todo.priority_level === 'high' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                todo.priority_level === 'urgent' ? 'bg-red-100 text-red-800 border border-red-200' :
                                'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                <svg className="-ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 9.586 14.586 6H12z" clipRule="evenodd" />
                                </svg>
                                {todo.priority_level.charAt(0).toUpperCase() + todo.priority_level.slice(1)}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                <svg className="-ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {todo.category}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                <svg className="-ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTimeAgo(todo.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => startEditing(todo)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors duration-200"
                            title="Edit task"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors duration-200"
                            title="Delete task"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Todo Dashboard. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              {currentUser && (
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  Change Password
                </button>
              )}
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/support" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}