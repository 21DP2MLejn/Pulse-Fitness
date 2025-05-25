"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"
import Cookies from "js-cookie"
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()
  const { login } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", { email });
      
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Login response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      console.log("Login successful, token received:", data.token);
      
      Cookies.set("token", data.token, { 
        expires: 7, 
        path: '/',
        sameSite: 'lax' 
      });
      
      localStorage.setItem('authToken', data.token);
      login(data.token, data.user);
      
      setTimeout(() => {
        console.log("Redirecting to home page...");
        console.log("Token in cookie after login:", Cookies.get("token"));
        console.log("Token in localStorage after login:", localStorage.getItem('authToken'));
        router.push("/home");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <h1 className="text-3xl font-bold text-center mb-6">{t('login.to.pulsefitness')}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                {t('auth.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/password-reset" className="text-indigo-600 hover:text-indigo-500">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}></div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          {t('auth.dontHaveAccount')}{" "}
          <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
