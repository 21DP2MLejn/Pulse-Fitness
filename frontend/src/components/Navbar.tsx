'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { FiShoppingCart } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/auth/login';
  };

  return (
    <nav className={`fixed w-full z-50 top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Pulse Fitness
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/home"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/'
                    ? 'text-primary border-b-2 border-primary'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/products'
                    ? 'text-primary border-b-2 border-primary'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
              </Link>
              <Link
                href="/profile"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/profile'
                    ? 'text-primary border-b-2 border-primary'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/cart" 
              className="mr-4"
            >
              <FiShoppingCart />
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
            <div className="ml-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
