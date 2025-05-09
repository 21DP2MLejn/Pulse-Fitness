'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function SubscriptionsPage() {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication error. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/admin/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data.data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication error. Please log in again.');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/admin/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription');
      }

      toast.success('Subscription deleted successfully');
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error('Failed to delete subscription');
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
            <h1 className="text-3xl font-bold">{t('admin.subscriptions')}</h1>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.manageSubscriptions')}
            </p>
          </div>
          <Link
            href="/admin/subscriptions/create"
            className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white transition-colors`}
          >
            <FiPlus className="mr-2" /> {t('admin.createSubscription')}
          </Link>
        </div>

        {subscriptions.length === 0 ? (
          <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <p className="text-xl">{t('admin.noSubscriptionsFound')}</p>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('admin.createFirstSubscription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{subscription.name}</h3>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/subscriptions/edit/${subscription.id}`}
                      className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                    >
                      <FiEdit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteSubscription(subscription.id)}
                      className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} text-red-500 transition-colors`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {subscription.description}
                </p>
                <div className="mt-4">
                  <p className="text-2xl font-bold">${subscription.price}</p>
                </div>
                {subscription.features && subscription.features.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t('admin.features')}:</h4>
                    <ul className="space-y-1">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheck className={`mr-2 mt-1 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
