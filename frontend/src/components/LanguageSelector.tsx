'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FiGlobe } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (newLanguage: 'en' | 'lv') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-1 px-3 py-2 rounded-md ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-200' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        aria-label={t('language.select')}
      >
        <FiGlobe className="mr-1" />
        <span className="uppercase">{language}</span>
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <button
            onClick={() => changeLanguage('en')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              language === 'en' 
                ? 'bg-indigo-600 text-white' 
                : isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('language.english')}
          </button>
          <button
            onClick={() => changeLanguage('lv')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              language === 'lv' 
                ? 'bg-indigo-600 text-white' 
                : isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('language.latvian')}
          </button>
        </div>
      )}
    </div>
  );
}
