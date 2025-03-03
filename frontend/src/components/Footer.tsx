'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PulseFitness</h3>
            <p className="text-sm">
              Your journey to fitness starts here. Join us and transform your life with expert guidance and support.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/workouts" className="text-sm hover:text-indigo-500 transition-colors">Workouts</Link></li>
              <li><Link href="/nutrition" className="text-sm hover:text-indigo-500 transition-colors">Nutrition</Link></li>
              <li><Link href="/progress" className="text-sm hover:text-indigo-500 transition-colors">Progress</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@pulsefitness.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Fitness Street, Gym City</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} PulseFitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
