'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import type { CartItem } from '@/types/product';

export default function CartPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual cart data fetching
    fetch('http://localhost:8000/api/cart')
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch cart:', err);
        setLoading(false);
      });
  }, []);

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.quantity + delta, item.product.stock)),
            }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== itemId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 10; // Example shipping cost
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Add some products to your cart and they will show up here
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className={`flex gap-4 p-4 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className={`flex items-center rounded-lg border ${
                    isDark ? 'border-gray-700' : 'border-gray-300'
                  }`}>
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className={`p-2 ${item.quantity <= 1 ? 'text-gray-400' : ''}`}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 py-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className={`p-2 ${item.quantity >= item.product.stock ? 'text-gray-400' : ''}`}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <p className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={`lg:col-span-1 ${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg h-fit`}>
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mt-6">
              Proceed to Checkout
            </button>
            <Link
              href="/products"
              className="block text-center text-primary hover:text-primary/90 transition-colors mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
