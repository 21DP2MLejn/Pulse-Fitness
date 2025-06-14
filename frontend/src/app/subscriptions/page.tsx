'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  specifications?: Record<string, string>;
  subscription_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export default function SubscriptionsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);

    // Fetch all available subscriptions
    fetch('http://localhost:8000/api/subscriptions')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        return res.json();
      })
      .then(data => {
        console.log('Subscriptions data:', data);
        if (data.data) {
          setSubscriptions(data.data);
        } else if (Array.isArray(data)) {
          setSubscriptions(data);
        } else {
          console.error('Unexpected response format:', data);
          setSubscriptions([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching subscriptions:', err);
        setError('Failed to load subscription plans. Please try again later.');
        setLoading(false);
      });

    // If authenticated, fetch user's current subscription
    if (token) {
      fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch user data');
          }
          return res.json();
        })
        .then(userData => {
          console.log('User data received:', userData);
          // Check if user has a subscription
          if (userData.user && userData.user.subscription_id) {
            console.log('User has subscription_id:', userData.user.subscription_id);
            // Set the subscription data directly from the user data
            // This avoids making an additional API call that might not exist
            setUserSubscription({
              id: userData.user.subscription_id,
              name: userData.user.subscription_name || 'Your Subscription',
              description: 'Your active fitness subscription',
              price: 0, // We don't know the price from this endpoint
              features: ['Access to all training sessions', 'Make reservations'],
              status: 'active',
              start_date: userData.user.subscription?.start_date,
              end_date: userData.user.subscription?.end_date
            });
          } else {
            console.log('User has no subscription');
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}>
            <h2 className="text-2xl font-bold mb-4 text-red-500">{t('error')}</h2>
            <p className="mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors`}
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2 text-center">{t('subscriptions.title')}</h1>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          {t('subscriptions.subtitle')}
        </p>

        {subscriptions.length === 0 ? (
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}>
            <p>{t('subscriptions.noPlansAvailable')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptions.map((subscription) => {
              const isCurrentPlan = userSubscription && userSubscription.id === subscription.id;
              
              return (
                <div 
                  key={subscription.id} 
                  className={`rounded-xl overflow-hidden transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg ${isCurrentPlan ? 'ring-2 ring-purple-500 transform scale-[1.02]' : ''}`}
                >
                  <div className={`p-6 ${isCurrentPlan ? 'bg-purple-600 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="text-2xl font-bold mb-2">{subscription.name}</h3>
                    <p className="opacity-90 mb-4">{subscription.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">€{subscription.price}</span>
                      <span className="text-sm ml-2">/month</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-4">{t('subscriptions.features')}</h4>
                    <ul className="space-y-3">
                      {subscription.features && Array.isArray(subscription.features) ? 
                        subscription.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))
                      : typeof subscription.features === 'string' ?
                        <li className="flex items-start">
                          <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>{subscription.features}</span>
                        </li>
                      : null
                      }
                    </ul>

                    <div className="mt-8">
                      {isCurrentPlan ? (
                        <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 rounded-lg text-center">
                          {t('subscriptions.currentPlan')}
                        </div>
                      ) : (
                        <Link 
                          href={isAuthenticated ? `/subscriptions/${subscription.id}` : '/auth/login'}
                          className={`block w-full py-3 px-4 text-center rounded-lg ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors`}
                        >
                          {isAuthenticated ? t('subscriptions.selectPlan') : t('subscriptions.loginToSubscribe')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}