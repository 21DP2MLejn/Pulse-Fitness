'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { FiMoon, FiSun, FiShoppingCart, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';
  const cartItemCount = items.length;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`fixed w-full z-50 top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
                {t('app.name')}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/home"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/home' || pathname === '/'
                    ? 'text-primary border-b-2 border-primary'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/products"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/products' || pathname.startsWith('/products/')
                    ? 'text-primary border-b-2 border-primary'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('nav.products')}
              </Link>
              <Link
                href="/subscriptions"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/subscriptions'
                    ? 'text-primary border-b-2 border-primary'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('nav.subscriptions')}
              </Link>
              {isAuthenticated && (
                <Link
                  href="/reservations"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith('/reservations')
                      ? 'text-primary border-b-2 border-primary'
                      : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('nav.schedule')}
                </Link>
              )}
              {isAuthenticated && (
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
                  {t('nav.profile')}
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === '/admin'
                        ? 'text-primary border-b-2 border-primary'
                        : isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t('nav.admin')}
                  </Link>
                  <Link
                    href="/admin/training-sessions"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname.startsWith('/admin/training-sessions')
                        ? 'text-primary border-b-2 border-primary'
                        : isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Manage Sessions
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            {isAuthenticated && (
              <Link
                href="/cart" 
                className={`mr-4 relative ${isDark ? 'text-white' : 'text-gray-800'} hover:text-primary transition-colors`}
              >
                <FiShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <div className="ml-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
