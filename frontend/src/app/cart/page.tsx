'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import router from 'next/router';
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
  const { theme } = useTheme();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to prevent layout shift
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateQuantity = (productId: string | number, delta: number) => {
    const item = items.find(item => item.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + delta);
    }
  };

  const handleRemoveItem = (productId: string | number) => {
    removeFromCart(productId);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10 : 0; // Example shipping cost, free if cart is empty
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiShoppingBag size={60} className={`${isDark ? 'text-gray-400' : 'text-gray-300'}`} />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
            <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('cart.emptyMessage')}</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiArrowLeft />
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className={`flex gap-4 p-4 rounded-lg ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={item.product.images && item.product.images.length > 0 
                      ? `http://localhost:8000/api/images/${item.product.images[0].replace(/^\/storage\//, '')}` 
                      : '/images/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/products/${item.product.id}`} className="hover:text-indigo-600 transition-colors">
                        <h3 className="font-semibold">{item.product.name}</h3>
                      </Link>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        €{typeof item.product.price === 'number' 
                          ? item.product.price.toFixed(2) 
                          : parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className={`flex items-center rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className={`p-2 ${item.quantity <= 1 ? 'text-gray-400' : ''}`}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        className={`p-2 ${item.quantity >= (item.product.stock || 10) ? 'text-gray-400' : ''}`}
                        disabled={item.quantity >= (item.product.stock || 10)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <p className="font-semibold">
                      €{(typeof item.product.price === 'number' 
                        ? item.product.price * item.quantity 
                        : parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className={`lg:col-span-1 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg shadow-sm h-fit sticky top-20`}>
            <h2 className="text-xl font-bold mb-6">{t('cart.orderSummary')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>€{shipping.toFixed(2)}</span>
              </div>
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4`}>
                <div className="flex justify-between font-bold">
                  <span>{t('cart.total')}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" className="text-white">
              <button 
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-6 flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={18} />
                {t('cart.checkout')}
              </button>
              </Link>
              <Link
                href="/products"
                className="block text-center text-indigo-600 hover:text-indigo-500 transition-colors mt-4"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
