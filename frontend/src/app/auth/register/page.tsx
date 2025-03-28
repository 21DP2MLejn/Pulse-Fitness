'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiCalendar, FiMapPin, FiSun, FiMoon, FiPhone } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import countryList from 'react-select-country-list';
import Select from 'react-select';

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
      
      // Handle non-JSON responses (like HTML error pages)
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

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className={`max-w-2xl mx-auto p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold text-center mb-4">Register to Pulse Fitness</h2>
        {error && <p className="text-red-500 text-center mb-4 p-2 rounded bg-red-100">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'First Name', name: 'name', icon: <FiUser /> },
            { label: 'Last Name', name: 'lastname', icon: <FiUser /> },
            { label: 'Email', name: 'email', type: 'email', icon: <FiMail /> },
            { label: 'Password', name: 'password', type: 'password', icon: <FiLock /> },
            { label: 'Confirm Password', name: 'password_confirmation', type: 'password', icon: <FiLock /> },
            { label: 'Date of Birth', name: 'dob', type: 'date', icon: <FiCalendar /> },
            { label: 'Phone', name: 'phone', type: 'tel', icon: <FiPhone /> },
            { label: 'City', name: 'city', icon: <FiMapPin /> },
            { label: 'Address', name: 'address', icon: <FiMapPin /> },
            { label: 'Postal Code', name: 'postalcode', icon: <FiMapPin /> },
          ].map(({ label, name, type = 'text', icon }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <div className={`flex items-center p-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-500"}>{icon}</span>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  className={`w-full ml-2 outline-none ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                  required
                />
              </div>
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Country</label>
            <Select
              options={countries}
              value={countries.find((c) => c.value === formData.country)}
              onChange={handleCountryChange}
              className="w-full"
              placeholder="Select a country"
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: theme === 'dark' ? '#374151' : 'white',
                  borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: theme === 'dark' ? '#374151' : 'white',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused
                    ? theme === 'dark'
                      ? '#4B5563'
                      : '#F3F4F6'
                    : theme === 'dark'
                    ? '#374151'
                    : 'white',
                  color: theme === 'dark' ? 'white' : 'black',
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: theme === 'dark' ? 'white' : 'black',
                }),
              }}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
