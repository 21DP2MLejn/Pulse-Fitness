'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiCalendar, FiMapPin, FiSun, FiMoon, FiPhone, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import countryList from 'react-select-country-list';
import Select from 'react-select';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface FormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  dob: string;
  country: string;
  phone: string;
  city: string;
  address: string;
  postalcode: string;
}

interface CountryOption {
  label: string;
  value: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useLanguage();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    dob: '',
    country: '',
    phone: '',
    city: '',
    address: '',
    postalcode: '',
  });

  const countries = countryList().getData() as CountryOption[];
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // For multi-step form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    setFormData((prev) => ({ ...prev, country: selectedOption ? selectedOption.value : '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Registration data being sent:", formData);
      
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      console.log("Registration response status:", response.status);
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') === -1) {
        const htmlError = await response.text();
        console.error("Non-JSON response received:", htmlError);
        throw new Error('Server error: The server returned an invalid response');
      }

      const data = await response.json();
      console.log("Registration response data:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/auth/login');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.lastname || !formData.email || !formData.password || !formData.password_confirmation) {
        setError(t('auth.fillAllFields'));
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        setError(t('auth.passwordsDoNotMatch'));
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderFormStep = () => {
    if (step === 1) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.firstName')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.firstName')}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.lastName')}</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.lastName')}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.email')}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.password')}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.confirmPassword')}</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.confirmPassword')}
            />
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('auth.continue')} <FiArrowRight className="inline ml-1" />
            </button>
            <p className="text-xs text-center mt-2 text-gray-500">
              {t('auth.agreeToTerms')}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.dob')}</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.phone')}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.country')}</label>
            <Select
              options={countries}
              value={countries.find((c) => c.value === formData.country)}
              onChange={handleCountryChange}
              className="w-full"
              placeholder={t('auth.SelectCountry')}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: isDark ? '#374151' : 'white',
                  borderColor: isDark ? '#4B5563' : '#D1D5DB',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: isDark ? '#374151' : 'white',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused 
                    ? isDark ? '#4B5563' : '#F3F4F6'
                    : isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : 'black',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: isDark ? 'white' : 'black',
                }),
              }}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.city')}</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.city')}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.postalcode')}</label>
            <input
              type="text"
              name="postalcode"
              value={formData.postalcode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.postalcode')}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('auth.address')}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              required
              placeholder={t('auth.address')}
            />
          </div>
          
          <div className="md:col-span-2 mt-4 flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className={`w-1/3 py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
                isDark 
                  ? 'border-gray-600 text-white hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {t('auth.back')}
            </button>
            <button
              type="submit"
              className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : t('auth.completeRegistration')}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-700" />}
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden">
        {/* Left side - Branding */}
        <div className="hidden md:flex md:w-1/3 bg-indigo-600 text-white p-10 flex-col justify-between">
          <div className="flex flex-col justify-center items-center h-full text-white p-12">
            <h1 className="text-4xl font-bold mb-4">{t('app.name')}</h1>
            <p className="text-xl mb-6 text-center">
              {t('app.tagline')}
            </p>
            <div className="w-16 h-1 bg-white rounded-full mb-8"></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className={`w-full md:w-2/3 p-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {t('auth.createAccount')}
            </h2>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t('auth.step')} {step} {t('auth.of2')}: {step === 1 ? t('auth.accountDetails') : t('auth.personalInfo')}
            </p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mt-4 mb-6">
              <div 
                className="h-full bg-indigo-600 rounded-full" 
                style={{ width: step === 1 ? "50%" : "100%" }}
              ></div>
            </div>
            
            {step === 1 && (
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {t('auth.accountinformation')}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t('auth.accountDetailsDescription')}
                </p>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {t('auth.personalinformation')}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t('auth.personalInfoDescription')}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {renderFormStep()}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? "border-gray-600" : "border-gray-300"}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDark ? "bg-gray-800" : "bg-white"} ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t('auth.or')}
                </span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm">
              {t('auth.alreadyHaveAccount')}{" "}
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
