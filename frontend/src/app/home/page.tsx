"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

export default function HomePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    console.log("Home page - Auth state:", { isLoading, isAuthenticated });
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    console.log("Home page - Still loading auth state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("Home page - Not authenticated, showing nothing");
    return null;
  }

  console.log("Home page - Rendering for authenticated user:", user);
  
  const userName = user?.name || "User";

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('welcome.back.home', { name: userName })}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">{t('see.latest.products')}</h2>
              <p className="text-sm mb-4">{t('see.latest.products.desc')}</p>
              <button
                onClick={() => router.push("/products")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                {t('view.products.button')}
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">{t('group.workout')}</h2>
              <p className="text-sm mb-4">{t('group.workout.desc')}</p>
              <button
                onClick={() => router.push("/reservations")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                {t('make.reservation')}
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">{t('my.subscriptions')}</h2>
              <p className="text-sm mb-4">{t('my.subscriptions.desc')}</p>
              <button
                onClick={() => router.push("/subscriptions")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                {t('view.subscriptions')}
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">{t('my.orders')}</h2>
              <p className="text-sm mb-4">{t('my.orders.desc')}</p>
              <button
                onClick={() => router.push("/orders")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                {t('view.orders')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
