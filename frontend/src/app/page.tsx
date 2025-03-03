'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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