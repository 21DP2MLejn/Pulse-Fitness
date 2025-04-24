'use client';

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiPackage, FiUsers, FiShoppingCart, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface DashboardStats {
  products: number;
  users: number;
  orders: number;
}

export default function AdminDashboard() {
  const { theme } = useTheme();
  const { user, getToken } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    users: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Fetch product count
      const productsResponse = await fetch('http://localhost:8000/api/get-products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch user stats
      const usersResponse = await fetch('http://localhost:8000/api/get-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // For now, we'll use a placeholder for orders
      // In a real app, you would fetch this from the backend
      const ordersCount = 156;
      
      if (!productsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const productsData = await productsResponse.json();
      const usersData = await usersResponse.json();
      
      // Get the actual counts
      const productsCount = productsData.data ? productsData.data.length : (Array.isArray(productsData) ? productsData.length : 0);
      const usersCount = usersData.data ? usersData.data.length : (Array.isArray(usersData) ? usersData.length : 0);
      
      setStats({
        products: productsCount,
        users: usersCount,
        orders: ordersCount
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to fetch dashboard statistics. Please try again later.');
      // Set fallback stats in case of error
      setStats({
        products: 0,
        users: 0,
        orders: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.welcome', { name: user?.name || 'Admin' })}
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <FiPackage size={24} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('admin.totalProducts')}</p>
                <h3 className="text-2xl font-semibold">{stats.products}</h3>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <FiUsers size={24} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('admin.totalUsers')}</p>
                <h3 className="text-2xl font-semibold">{stats.users}</h3>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <FiShoppingCart size={24} />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('admin.totalOrders')}</p>
                <h3 className="text-2xl font-semibold">{stats.orders}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <FiPackage size={20} />
              </div>
              <h3 className="ml-3 text-xl font-semibold">{t('admin.products')}</h3>
            </div>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.manageProducts')}
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              {t('admin.viewProducts')} →
            </Link>
          </div>
          
          <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-green-100 text-green-500">
                <FiUsers size={20} />
              </div>
              <h3 className="ml-3 text-xl font-semibold">{t('admin.users')}</h3>
            </div>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.manageUsers')}
            </p>
            <Link
              href="/admin/users"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              {t('admin.viewUsers')} →
            </Link>
          </div>
          
          <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                <FiSettings size={20} />
              </div>
              <h3 className="ml-3 text-xl font-semibold">{t('admin.settings')}</h3>
            </div>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.manageSettings')}
            </p>
            <Link
              href="/admin/settings"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              {t('admin.viewSettings')} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
