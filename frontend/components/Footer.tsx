'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by checking for access token
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Portfolio Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://saqib.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors duration-200">
                  My Portfolio
                </Link>
              </li>
              <li>
                <Link href="https://bookofai.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors duration-200">
                  AI Book Project
                </Link>
              </li>
              <li>
                <Link href="https://smart.wuaze.com/?i=1" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors duration-200">
                  E-commerce Website
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-indigo-300 transition-colors duration-200">
                  Home
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/dashboard" className="hover:text-indigo-300 transition-colors duration-200">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="hover:text-indigo-300 transition-colors duration-200">
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/signin" className="hover:text-indigo-300 transition-colors duration-200">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-indigo-300 transition-colors duration-200">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-300 text-sm">
              A modern todo application with advanced features like due dates, priority levels, and categories to help you manage your tasks efficiently.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Todo App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}