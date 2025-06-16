'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiSearch, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

interface User {
  id: string | number;
  name: string;
  lastname: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
  address?: string;
  postalcode?: string;
  country?: string;
  dob?: string;
  created_at?: string;
}

export default function AdminUsersPage() {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication error. Please log in again.');
        return;
      }
      
      console.log('Fetching users with token');
      const response = await fetch(`${API_URL}/get-users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('Users fetched:', data);
      
      if (data.data) {
        setUsers(data.data);
      } else {
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.lastname && user.lastname.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('admin.users')}</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${
                viewMode === 'table' 
                  ? 'bg-indigo-600 text-white' 
                  : isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('admin.searchUsers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div 
                key={user.id}
                className={`rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    user.role === 'admin' ? 'bg-indigo-600' : 'bg-blue-500'
                  }`}>
                    {user.name?.charAt(0).toUpperCase()}
                    {user.lastname ? user.lastname.charAt(0).toUpperCase() : ''}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">
                      {user.name} {user.lastname}
                    </h3>
                    <span className={`text-sm ${
                      user.role === 'admin' 
                        ? 'text-indigo-500' 
                        : isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiMail className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    <span className="ml-2">{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center">
                      <FiPhone className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      <span className="ml-2">{user.phone}</span>
                    </div>
                  )}
                  
                  {user.city && user.address && (
                    <div className="flex items-center">
                      <FiMapPin className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      <span className="ml-2">
                        {user.address}, {user.city} {user.postalcode}
                      </span>
                    </div>
                  )}
                  
                  {user.country && (
                    <div className="flex items-center">
                      <span className={`ml-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.country}
                      </span>
                    </div>
                  )}
                  
                  {user.dob && (
                    <div className="flex items-center">
                      <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      <span className="ml-2">
                        {new Date(user.dob).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('admin.joined')}: {user.created_at 
                      ? new Date(user.created_at).toLocaleDateString() 
                      : 'Unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-lg shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          user.role === 'admin' ? 'bg-indigo-600' : 'bg-blue-500'
                        }`}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{user.name} {user.lastname}</div>
                          {user.phone && (
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.city && user.country ? `${user.city}, ${user.country}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.created_at 
                        ? new Date(user.created_at).toLocaleDateString() 
                        : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <FiEdit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {t('admin.noUsersFound')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
