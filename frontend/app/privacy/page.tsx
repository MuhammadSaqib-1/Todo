'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600">
              Your privacy is important to us. Learn how we collect and protect your information.
            </p>
          </div>

          <div className="mt-8 prose max-w-none text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">2. How We Use Your Information</h2>
            <p>
              We use information about you to provide, maintain, and improve our services, to communicate with you, and to ensure the security of our services.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Information Sharing and Disclosure</h2>
            <p>
              We do not share your personal information with companies, organizations, or individuals outside of TodoPro except in limited circumstances.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">5. Your Rights</h2>
            <p>
              Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete your information.
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <Link href="/terms">
              <Button
                type="button"
                className="py-2 px-4 text-sm font-medium rounded-lg shadow transition-all duration-300"
                variant="secondary"
              >
                Terms of Service
              </Button>
            </Link>
            <Link href="/">
              <Button
                type="button"
                className="py-2 px-4 text-sm font-medium rounded-lg shadow transition-all duration-300"
                variant="primary"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}