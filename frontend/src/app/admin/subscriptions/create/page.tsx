'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiSave, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateSubscriptionPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: ['']
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Subscription name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    // Filter out empty features
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');
    
    try {
      setSubmitting(true);
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication error. Please log in again.');
        return;
      }

      console.log('Sending subscription creation request:', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        features: filteredFeatures
      });

      const userResponse = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!userResponse.ok) {
        console.error('Failed to get user information');
        throw new Error('Failed to get user information. Please try again.');
      }

      const userData = await userResponse.json();
      const userId = userData.id || 1; 

      const response = await fetch('http://localhost:8000/api/admin/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          user_id: userId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          features: filteredFeatures,
          start_date: new Date().toISOString().split('T')[0],
          status: 'active'
        })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response (${response.status}). The API endpoint might be incorrect.`);
      }

      if (!response.ok) {
        try {
          
          const responseText = await response.text();
          console.error('Error response text:', responseText);
          
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (jsonError) {
            console.error('Failed to parse error response as JSON:', jsonError);
            throw new Error(`Server returned non-JSON response (${response.status}): ${responseText.substring(0, 100)}...`);
          }
          
          throw new Error(errorData.message || `Failed to create subscription: ${response.status}`);
        } catch (e) {
          console.error('Error handling response:', e);
          throw e;
        }
      }

      toast.success('Subscription created successfully');
      router.push('/admin/subscriptions');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin/subscriptions"
            className={`inline-flex items-center ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FiArrowLeft className="mr-2" /> {t('admin.backToSubscriptions')}
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.createSubscription')}</h1>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.fillSubscriptionDetails')}
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('admin.subscriptionName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Premium Subscription"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('admin.price')} *
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    $
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full pl-8 p-3 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="99.99"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('admin.description')} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Describe the subscription benefits"
                  required
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('admin.features')}
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FiPlus className="mr-1" size={14} /> {t('admin.addFeature')}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className={`flex-1 p-3 rounded-lg border ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="e.g. Unlimited access to all classes"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className={`ml-2 p-2 rounded-full ${
                            isDark
                              ? 'bg-gray-700 hover:bg-gray-600 text-red-400'
                              : 'bg-gray-100 hover:bg-gray-200 text-red-500'
                          }`}
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/subscriptions"
                className={`px-4 py-2 rounded-lg mr-4 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {t('admin.cancel')}
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isDark
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                } text-white transition-colors ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {t('admin.saving')}
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> {t('admin.saveSubscription')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
