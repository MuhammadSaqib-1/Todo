'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Contact Support
            </h2>

            <p className="text-sm text-gray-600 mb-8">
              We're here to help you with any issues or questions you may have.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Email Support</h3>
              <p className="text-sm text-blue-700">
                Send us an email at{' '}
                <a href="mailto:support@todopro.example.com" className="underline hover:text-blue-900">
                  support@todopro.example.com
                </a>
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Documentation</h3>
              <p className="text-sm text-green-700">
                Visit our{' '}
                <a href="https://docs.todopro.example.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">
                  documentation
                </a>{' '}
                for guides and tutorials.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">FAQ</h3>
              <p className="text-sm text-purple-700">
                Check our{' '}
                <a href="https://faq.todopro.example.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-900">
                  frequently asked questions
                </a>{' '}
                for quick answers.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/">
              <Button
                type="button"
                className="w-full py-3 px-4 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                variant="primary"
              >
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}