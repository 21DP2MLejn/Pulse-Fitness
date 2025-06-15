'use client';

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiSearch, FiShoppingCart, FiCalendar, FiUser, FiDollarSign } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminOrdersPage() {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toString().includes(searchQuery)
  );

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
            <h1 className="text-3xl font-bold">{t('admin.orders')}</h1>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.manageOrders')}
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('admin.searchOrders')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        <div className={`rounded-lg shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('admin.orderId')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('admin.customer')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('admin.amount')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('admin.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('admin.date')}
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiShoppingCart className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      #{order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDollarSign className={`mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      {typeof order.total_amount === 'number' 
                        ? order.total_amount.toFixed(2)
                        : parseFloat(order.total_amount).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {t(`admin.orderStatus.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 