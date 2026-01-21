'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../lib/api';
import { Button } from '@/components/Button';

export default function SigninPage() {
  const [username, setUsername] = useState(''); // Using email as username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions while loading
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      // Step 1: Attempt login
      const response = await authAPI.login({ username, password });
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);

      // Step 2: Get the current user to retrieve user ID - this is critical for dashboard access
      // We need to ensure this succeeds before proceeding to the dashboard
      try {
        const userResponse = await authAPI.getCurrentUser();
        const userId = userResponse.data.id;
        localStorage.setItem('user_id', userId.toString());

        // Step 3: Navigate to dashboard with a small delay to ensure state is properly set
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } catch (userErr: any) {
        // If getting user profile fails, try to decode the token to extract user info
        console.error('Error getting user profile after login:', userErr);

        // As a fallback, we can decode the JWT token to extract user info if needed
        // For now, let's show an error but still allow navigation after a brief delay
        setError('Login successful but profile data is temporarily unavailable. Redirecting...');

        // Allow a brief moment to show the message, then redirect
        setTimeout(() => {
          router.push('/dashboard');
          setError(''); // Clear the message after redirect
        }, 2000);
      }
    } catch (err: any) {
      console.error('Login error:', err); // Log the full error for debugging

      // Handle different error response structures
      let errorMessage = 'Something went wrong. Please try again.';

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.data) {
          if (typeof err.response.data === 'object') {
            // Prioritize 'detail' field (used by FastAPI for authentication errors)
            if (err.response.data.detail) {
              errorMessage = String(err.response.data.detail);
            }
            // Then check for 'message' field
            else if (err.response.data.message) {
              errorMessage = String(err.response.data.message);
            }
            // Then check for 'error' field
            else if (err.response.data.error) {
              errorMessage = String(err.response.data.error);
            }
            // Handle array of errors - might be Pydantic validation errors
            else if (Array.isArray(err.response.data)) {
              // Pydantic validation errors often come as arrays with objects like {loc, msg, type}
              if (err.response.data.length > 0 && typeof err.response.data[0] === 'object' && err.response.data[0].msg) {
                errorMessage = String(err.response.data[0].msg);
              } else if (err.response.data.length > 0) {
                const firstItem = err.response.data[0];
                if (typeof firstItem === 'object' && firstItem.msg) {
                  errorMessage = String(firstItem.msg);
                } else if (typeof firstItem === 'object' && firstItem.detail) {
                  errorMessage = String(firstItem.detail);
                } else if (typeof firstItem === 'object') {
                  // If it's still an object, try to get a meaningful string representation
                  errorMessage = firstItem.toString ? firstItem.toString() : JSON.stringify(firstItem).substring(0, 100);
                } else {
                  errorMessage = String(firstItem);
                }
              } else {
                errorMessage = 'Validation error occurred';
              }
            }
            // If object but no known fields, fall back to status-based message
            else {
              if (err.response.status === 401) {
                errorMessage = 'Incorrect email or password';
              } else if (err.response.status === 400) {
                errorMessage = 'Invalid request. Please check your credentials.';
              } else if (err.response.status === 404) {
                errorMessage = 'Server Error: The login endpoint was not found. Please contact support.';
              } else {
                errorMessage = `Server Error: ${err.response.status}. Please try again.`;
              }
            }
          }
          // Handle direct string response
          else if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          }
          // For other response formats, use status code
          else {
            if (err.response.status === 401) {
              errorMessage = 'Incorrect email or password';
            } else if (err.response.status === 400) {
              errorMessage = 'Invalid request. Please check your credentials.';
            } else if (err.response.status === 404) {
              errorMessage = 'Server Error: The login endpoint was not found. Please contact support.';
            } else {
              errorMessage = `Server Error: ${err.response.status}. Please try again.`;
            }
          }
        }
        // No response data
        else {
          if (err.response.status === 401) {
            errorMessage = 'Incorrect email or password';
          } else if (err.response.status === 400) {
            errorMessage = 'Invalid request. Please check your credentials.';
          } else if (err.response.status === 404) {
            errorMessage = 'Server Error: The login endpoint was not found. Please contact support.';
          } else {
            errorMessage = `Server Error: ${err.response.status}. Please try again.`;
          }
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Network error: Unable to reach the server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = err.message || 'Something went wrong. Please try again.';
      }

      // Ensure the error message is always a string to prevent React rendering errors
      const finalErrorMessage = typeof errorMessage === 'string' ? errorMessage :
                                errorMessage?.toString?.() || 'An error occurred. Please try again.';
      setError(finalErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 transition-all duration-300 hover:shadow-2xl border border-gray-100 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>

          <div className="relative z-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Please enter your details
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="email"
                    autoComplete="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-300 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

        </div>

        {/* Additional info section */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-indigo-500 hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}