'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
// Import required modules
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import type { Product } from '@/types/product';

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from the API
    fetch('http://localhost:8000/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then(data => {
        console.log('Products fetched:', data);
        // Check if the response has the expected structure
        if (data.data) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Unexpected response format:', data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative h-screen flex items-center ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 to-purple-900' 
          : 'bg-gradient-to-r from-purple-600 to-blue-600'
      }`}>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Body, Transform Your Life
            </h1>
            <p className="text-xl mb-8">
              Join Pulse Fitness and start your journey to a healthier, stronger you.
              Expert trainers, state-of-the-art equipment, and a supportive community await.
            </p>
            <button className={`${
              isDark 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-white text-purple-600 hover:bg-gray-100'
            } px-8 py-3 rounded-md transition-colors flex items-center space-x-2`}>
              <span>Get Started</span>
              <FiArrowRight />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase - Simple Modern Design */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Featured Products
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Discover our premium selection of fitness equipment and apparel
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="relative">
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="product-swiper"
              >
                {products.length > 0 ? products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <Link href={`/products/${product.id}`}>
                      <div className={`h-full rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-sm hover:shadow-md`}>
                        <div className="relative aspect-square overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <Image 
                              src={`http://localhost:8000/api/images/${product.images[0].replace(/^\/storage\//, '')}`}
                              alt={product.name} 
                              width={300}
                              height={300}
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              unoptimized
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              <span className="text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className={`font-medium mb-2 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {product.name}
                          </h3>
                          <div className="flex justify-between items-center">
                            <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                              ${product.price}
                            </span>
                            <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )) : (
                  <div className="text-center py-10">
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No products available</p>
                  </div>
                )}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${
        isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-600'
      }`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Expert Trainers',
                description: 'Work with certified professionals who are passionate about helping you achieve your goals.'
              },
              {
                title: 'Modern Equipment',
                description: 'Access to state-of-the-art fitness equipment and facilities.'
              },
              {
                title: 'Flexible Plans',
                description: 'Choose from various membership options that suit your needs and schedule.'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                } p-6 rounded-lg shadow-sm transition-colors`}
              >
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Ready to Start Your Journey?</h2>
            <button className={`${
              isDark 
                ? 'bg-gray-900 hover:bg-gray-800' 
                : 'bg-white text-purple-600 hover:bg-gray-100'
            } px-8 py-3 rounded-md transition-colors`}>
              Join Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}