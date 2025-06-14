'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { theme } = useTheme();
  const { isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const isDark = theme === 'dark';
  const { t, language } = useLanguage();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors mb-4"
          >
            <FiArrowLeft />
            {t('nav.home')}
          </Link>
          <h1 className="text-3xl font-bold">{t('my.orders')}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className={`${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border p-4 rounded-lg flex items-start gap-3`}>
            <FiAlertCircle className="text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium">{t('error')}</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {t('tryAgain')}
              </button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-8 rounded-lg text-center`}>
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-500 mb-4">
              <FiPackage size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">{t('admin.noOrdersFound')}</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {t('my.orders.desc')}
            </p>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('view.products.button')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm overflow-hidden`}
              >
                <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                      {t('admin.orderId')}: #{order.order_number}
                    </p>
                    <h3 className="font-bold">
                      {order.customer_first_name} {order.customer_last_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <FiClock className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(`admin.orderStatus.${order.status.toLowerCase()}`) || order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-bold">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium mb-3">{t('checkout.items')}</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div 
                        key={item.id}
                        className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                      >
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('cart.quantity')}: {item.quantity} × ${Number(item.product_price).toFixed(2)}
                          </p>
                        </div>
                        <div className="font-medium">
                          ${Number(item.total).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`mt-4 pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('cart.subtotal')}:</span>
                      <span>${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('cart.shipping')}:</span>
                      <span>${Number(order.shipping_cost).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 font-bold">
                      <span>{t('cart.total')}:</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
