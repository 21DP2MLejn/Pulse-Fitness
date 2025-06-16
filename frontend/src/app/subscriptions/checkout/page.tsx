'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function SubscriptionCheckoutPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    const id = searchParams.get('id');
    
    if (id) {
      router.replace(`/subscriptions/checkout/${id}`);
    } else {
      router.replace('/subscriptions');
    }
  }, [router, searchParams]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
