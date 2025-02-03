'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FiMail, FiLock } from 'react-icons/fi';

const Loading = dynamic(() => import('@/components/ui/loading'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const ThemeToggle = dynamic(() => import('@/components/ui/theme-toggle'), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      localStorage.setItem('token', data.token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex">
      <ThemeToggle />
      {/* Removed redundant blob and blur elements */}
      <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Welcome Back!</h1>
            <p className="text-text/80">Continue your fitness journey with us</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-text placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-text placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 font-medium text-lg"
              >
                Sign in
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary/90 font-medium transition-colors duration-200"
              >
                Don&apos;t have an account? Join now
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Gradient */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white p-12">
          <div className="max-w-xl text-center">
            <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Transform Your Life</h2>
            <p className="text-xl text-black dark:text-white">Join our community of fitness enthusiasts and achieve your goals with expert guidance and support.</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        #blob {
          background-color: white;
          height: 34vmax;
          aspect-ratio: 1;
          position: absolute;
          left: 50%;
          top: 50%;
          translate: -50% -50%;
          border-radius: 50%;
          background: linear-gradient(to right, aquamarine, mediumpurple);
          animation: rotate 20s infinite;
          opacity: 0.8;
          z-index: 1;
        }

        #blur {
          height: 100%;
          width: 100%;
          position: absolute;
          z-index: 2;
          backdrop-filter: blur(12vmax);
        }

        body.dark #blob {
          background: linear-gradient(to right, darkslateblue, darkcyan);
        }
      `}</style>
    </div>
  );
}