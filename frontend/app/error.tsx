'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white py-12 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-8">
            We're sorry, but something went wrong. Please try again or contact support.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => reset()}
              className="w-full"
            >
              <Button
                type="button"
                className="w-full py-3 px-4 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                variant="primary"
              >
                Try Again
              </Button>
            </button>

            <Link href="/">
              <Button
                type="button"
                className="w-full py-3 px-4 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                variant="secondary"
              >
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}