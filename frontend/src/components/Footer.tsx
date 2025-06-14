'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('app.name')}</h3>
            <p className="text-sm">
              {t('footer.quote')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quick.links')}</h3>
            <ul className="space-y-2">
              <li><Link href="/reservations" className="text-sm hover:text-indigo-500 transition-colors">{t('quick.links.workouts')}</Link></li>
              <li><Link href="/products" className="text-sm hover:text-indigo-500 transition-colors">{t('quick.links.products')}</Link></li>
              <li><Link href="/subscriptions" className="text-sm hover:text-indigo-500 transition-colors">{t('quick.links.subscriptions')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li>{t('email')}: info@pulsefitness.com</li>
              <li>{t('phone')}: (123) 456-7890</li>
              <li>{t('address')}: 123 Fitness Street, Gym City</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t('app.name')}. {t('all.rights.reserved')}</p>
        </div>
      </div>
    </footer>
  );
}
