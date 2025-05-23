'use client';

import { useState, useEffect, use } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiCheck, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

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

export default function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const isDark = theme === 'dark';
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
      return;
    }

    // Fetch subscription details
    fetch(`http://localhost:8000/api/subscriptions/${resolvedParams.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch subscription details');
        }
        return res.json();
      })
      .then(data => {
        console.log('Subscription data:', data);
        if (data.data) {
          setSubscription(data.data);
        } else {
          setSubscription(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details. Please try again later.');
        setLoading(false);
      });

    // Fetch user's current subscription if any
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
        // If user has subscription data, fetch the details
        if (userData.subscription_id) {
          fetch(`http://localhost:8000/api/subscriptions/${userData.subscription_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(subData => {
              setUserSubscription(subData.data || subData);
            })
            .catch(err => {
              console.error('Error fetching user subscription:', err);
            });
        }
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
      });
  }, [resolvedParams.id, router]);

  const handleSubscribe = async () => {
    if (!subscription) return;
    
    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setSubscribing(true);
    try {
      // Get user data
      const userResponse = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      
      // Create subscription
      const response = await fetch('http://localhost:8000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
          start_date: new Date().toISOString().split('T')[0],
          status: 'active'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to subscribe');
      }

      toast.success(t('subscriptions.subscribeSuccess'));
      router.push('/profile');
    } catch (err: any) {
      console.error('Error subscribing:', err);
      toast.error(err.message || t('subscriptions.subscribeError'));
    } finally {
      setSubscribing(false);
    }
  };

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

  if (error || !subscription) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}>
            <h2 className="text-2xl font-bold mb-4 text-red-500">{t('error')}</h2>
            <p className="mb-6">{error || t('subscriptions.notFound')}</p>
            <Link 
              href="/subscriptions" 
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors inline-flex items-center`}
            >
              <FiArrowLeft className="mr-2" />
              {t('subscriptions.backToPlans')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentPlan = userSubscription && userSubscription.id === subscription.id;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-16">
        <Link 
          href="/subscriptions" 
          className={`inline-flex items-center mb-8 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
        >
          <FiArrowLeft className="mr-2" />
          {t('subscriptions.backToPlans')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h1 className="text-3xl font-bold mb-2">{subscription.name}</h1>
            <p className="text-lg mb-6 opacity-80">{subscription.description}</p>
            
            <div className="mb-8">
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">${subscription.price}</span>
                <span className="text-lg ml-2 opacity-70">/month</span>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">{t('subscriptions.features')}</h2>
              <ul className="space-y-4">
                {subscription.features && subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {subscription.specifications && Object.keys(subscription.specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('subscriptions.specifications')}</h2>
                <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  {Object.entries(subscription.specifications).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className={`flex ${index % 2 === 0 ? isDark ? 'bg-gray-700' : 'bg-gray-50' : ''}`}
                    >
                      <div className={`w-1/3 p-3 ${isDark ? 'border-r border-gray-700' : 'border-r border-gray-200'} font-medium`}>
                        {key}
                      </div>
                      <div className="w-2/3 p-3">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className={`p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-8`}>
              <h2 className="text-2xl font-bold mb-6">{t('subscriptions.summary')}</h2>
              
              <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between mb-2">
                  <span>{t('subscriptions.plan')}</span>
                  <span className="font-medium">{subscription.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>{t('subscriptions.billing')}</span>
                  <span className="font-medium">{t('subscriptions.monthly')}</span>
                </div>
                <div className="border-t my-3 border-gray-600"></div>
                <div className="flex justify-between font-bold">
                  <span>{t('subscriptions.total')}</span>
                  <span>${subscription.price}/month</span>
                </div>
              </div>
              
              {isCurrentPlan ? (
                <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-4 rounded-lg text-center mb-6">
                  {t('subscriptions.alreadySubscribed')}
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className={`w-full py-4 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors ${subscribing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {subscribing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      {t('subscriptions.processing')}
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="mr-2" />
                      {t('subscriptions.subscribe')}
                    </>
                  )}
                </button>
              )}
              
              <div className="mt-6 text-sm opacity-70 text-center">
                {t('subscriptions.termsNotice')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}