'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiUser, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL, API_BASE_URL } from '@/config/api';

export default function CheckoutPage() {
  const { theme } = useTheme();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const isDark = theme === 'dark';
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Define types for form data and errors
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    notes: string;
  }

  interface FormErrors {
    [key: string]: string;
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    notes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [items, router, orderPlaced]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pre-fill form data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        customer: formData,
        items: items.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price),
          quantity: item.quantity,
          total: (typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price)) * item.quantity
        })),
        subtotal,
        shipping,
        total,
        payment_method: 'credit_card', // Default payment method
        notes: formData.notes
      };

      // Prepare headers with authentication token if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (isAuthenticated) {
        const token = getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      setOrderPlaced(true);
      clearCart();
      console.log('Order placed successfully:', result);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck size={32} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">{t('checkout.orderSuccess')}</h1>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('checkout.thankYou')} {formData.firstName} {formData.lastName}, {t('checkout.orderConfirmation')} {formData.email}.
            </p>
            <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('checkout.orderDetails')} {t('checkout.email')} {t('checkout.shortly')}.
            </p>
            <div className="space-y-4">
              <Link
                href="/products"
                className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('checkout.continueShopping')}
              </Link>
              <Link
                href="/"
                className={`block w-full border py-3 px-6 rounded-lg transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('checkout.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors mb-4"
          >
            <FiArrowLeft />
            {t('checkout.backToCart')}
          </Link>
          <h1 className="text-3xl font-bold">{t('checkout.title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg shadow-sm`}>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiUser />
                  {t('checkout.contactInformation')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('checkout.firstName')} *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('checkout.lastName')} *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FiMail size={16} />
                      {t('checkout.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FiPhone size={16} />
                      {t('checkout.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiMapPin />
                  {t('checkout.shippingAddress')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('checkout.address')} *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.city')} *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${errors.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.zipCode')} *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${errors.zipCode ? 'border-red-500' : ''}`}
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.country')} *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${errors.country ? 'border-red-500' : ''}`}
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('checkout.notes')} (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={t('checkout.specialInstructions')}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiShoppingBag size={18} />
                    {t('checkout.placeOrder')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg shadow-sm h-fit sticky top-20`}>
            <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.product.images && item.product.images.length > 0 
                        ? `${API_BASE_URL}/api/images/${item.product.images[0].replace(/^\/storage\//, '')}` 
                        : '/images/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Qty: {item.quantity} × {typeof item.product.price === 'number' 
                        ? item.product.price.toFixed(2) 
                        : parseFloat(item.product.price).toFixed(2)}€
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {(typeof item.product.price === 'number' 
                        ? item.product.price * item.quantity 
                        : parseFloat(item.product.price) * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between">
                <span>{t('checkout.subtotal')}</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>{t('checkout.shipping')}</span>
                <span>{shipping.toFixed(2)}€</span>
              </div>
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-3 mt-3`}>
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('checkout.total')}</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}