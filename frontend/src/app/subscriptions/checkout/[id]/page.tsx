'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[] | string;
  specifications?: Record<string, string>;
  subscription_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data?: Subscription;
  error?: string;
  errors?: Record<string, string[]>;
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('id');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const { isAuthenticated, user, getToken } = useAuth();
  const isDark = theme === 'dark';
  
  // Client-side only code flag
  const [isMounted, setIsMounted] = useState(false);
  
  // Use useEffect to handle browser-only code
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (subscriptionId) {
      fetchSubscriptionDetails();
    } else {
      setError('No subscription selected');
      setLoading(false);
    }
  }, [isAuthenticated, subscriptionId, router]);

  const fetchSubscriptionDetails = async () => {
    try {
      const token = getToken();
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log('Subscription data:', data);
      
      if (data.status && data.data) {
        setSubscription(data.data);
      } else {
        setError(data.message || 'Failed to load subscription details');
      }
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subscription || !isAuthenticated) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication error. Please log in again.');
        return;
      }
      
      // Current date as start date
      const startDate = new Date().toISOString().split('T')[0];
      
      // Prepare the request data
      const subscriptionId = subscription?.id ? 
        (typeof subscription.id === 'string' ? parseInt(subscription.id, 10) : subscription.id) : 
        0;
      
      const requestData = {
        subscription_id: subscriptionId,
        start_date: startDate,
        status: 'active'
      };
      
      console.log('Subscription request data:', requestData);
      
      // Make the API request
      const response = await fetch('http://localhost:8000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned an invalid response. Please try again.');
      }
      
      const data: ApiResponse = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.status) {
        setSuccess(true);
        // Wait 2 seconds before redirecting to profile
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(data.message || 'Failed to subscribe. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Error subscribing:', err);
      setError(err.message || 'Unknown error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatFeatures = (features: string[] | string) => {
    if (Array.isArray(features)) {
      return features;
    }
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [features];
      } catch {
        return [features];
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-lg">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md text-center max-w-md mx-auto`}>
            <FiAlertCircle className="text-red-500 text-3xl mx-auto mb-4" />
            <div className="text-red-500 mb-4 text-lg">{error}</div>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/subscriptions"
                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center gap-2`}
              >
                <FiArrowLeft /> Back to Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className={`p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md text-center max-w-md mx-auto`}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Subscription Successful!</h2>
            <p className="mb-6">You have successfully subscribed to {subscription?.name}. Redirecting to your profile...</p>
            <div className="animate-pulse rounded-full h-2 w-32 bg-purple-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Only render the full content after client-side hydration is complete
  return (
    <div suppressHydrationWarning className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {isMounted ? (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/subscriptions"
            className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          >
            <FiArrowLeft /> Back to Subscriptions
          </Link>
          
          {error && (
            <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border`}>
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Subscription Details */}
            <div className="md:col-span-2">
              <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className={`p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h1 className="text-2xl font-bold mb-2">{subscription?.name}</h1>
                  <p className="opacity-90 mb-4">{subscription?.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${subscription?.price}</span>
                    <span className="text-sm ml-2">/month</span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Features</h4>
                  <ul className="space-y-3">
                    {formatFeatures(subscription?.features || []).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {subscription?.specifications && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-4">Specifications</h4>
                      <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        {typeof subscription.specifications === 'object' && !Array.isArray(subscription.specifications) ? (
                          Object.entries(subscription.specifications).map(([key, value], index) => (
                            <div 
                              key={key} 
                              className={`flex ${index % 2 === 0 ? isDark ? 'bg-gray-700' : 'bg-gray-50' : ''}`}
                            >
                              <div className={`w-1/3 p-3 ${isDark ? 'border-r border-gray-700' : 'border-r border-gray-200'} font-medium capitalize`}>
                                {key.replace('_', ' ')}
                              </div>
                              <div className="w-2/3 p-3">
                                {value}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3">
                            <div className="opacity-80">No detailed specifications available</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Checkout Summary */}
            <div>
              <div className={`rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md p-6 sticky top-20`}>
                <h2 className="text-xl font-bold mb-4">Subscription Summary</h2>
                
                <div className={`space-y-3 mb-6 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span className="font-medium">{subscription?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span>${subscription?.price}/month</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${subscription?.price}/month</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm opacity-80">
                    By clicking "Subscribe Now", you agree to add this membership to your account. This is a test environment - no payment is required.
                  </p>
                  <button
                    onClick={handleSubscribe}
                    disabled={processing}
                    className={`w-full py-3 px-4 rounded-lg ${
                      processing 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : isDark 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-purple-500 hover:bg-purple-600'
                    } text-white transition-colors flex items-center justify-center gap-2 font-medium`}
                  >
                    {processing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}