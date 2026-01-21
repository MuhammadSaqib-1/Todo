'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-600">
              Please read these terms carefully before using our service.
            </p>
          </div>

          <div className="mt-8 prose max-w-none text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TodoPro, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of TodoPro per device for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Disclaimer</h2>
            <p>
              This service is provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Limitations</h2>
            <p>
              In no event shall TodoPro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the service.
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <Link href="/">
              <Button
                type="button"
                className="py-2 px-4 text-sm font-medium rounded-lg shadow transition-all duration-300"
                variant="secondary"
              >
                Back to Home
              </Button>
            </Link>
            <Link href="/privacy">
              <Button
                type="button"
                className="py-2 px-4 text-sm font-medium rounded-lg shadow transition-all duration-300"
                variant="primary"
              >
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}