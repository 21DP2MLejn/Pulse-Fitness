'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiCalendar, FiMapPin, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import countryList from 'react-select-country-list';
import Select from 'react-select';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    dob: '',
    country: '',
    city: '',
    address: '',
    postalcode: '',
  });

  const countries = countryList().getData();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption ? selectedOption.value : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      router.push('/auth/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center">Register</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'First Name', name: 'name', icon: <FiUser /> },
          { label: 'Last Name', name: 'lastname', icon: <FiUser /> },
          { label: 'Email', name: 'email', type: 'email', icon: <FiMail /> },
          { label: 'Password', name: 'password', type: 'password', icon: <FiLock /> },
          { label: 'Confirm Password', name: 'password_confirmation', type: 'password', icon: <FiLock /> },
          { label: 'Date of Birth', name: 'dob', type: 'date', icon: <FiCalendar /> },
          { label: 'City', name: 'city', icon: <FiMapPin /> },
          { label: 'Address', name: 'address', icon: <FiMapPin /> },
          { label: 'Postal Code', name: 'postalcode', icon: <FiMapPin /> },
        ].map(({ label, name, type = 'text', icon }) => (
          <div key={name}>
            <label className="block text-sm font-medium">{label}</label>
            <div className="flex items-center p-2 border rounded-md">
              {icon}
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full ml-2 outline-none"
                required
              />
            </div>
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Country</label>
          <Select
            options={countries}
            value={countries.find((c) => c.value === formData.country)}
            onChange={handleCountryChange}
            className="w-full"
            placeholder="Select a country"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
}
