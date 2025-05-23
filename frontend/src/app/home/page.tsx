"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    console.log("Home page - Auth state:", { isLoading, isAuthenticated });
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state while checking authentication
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
  
  // Extract user name safely
  const userName = user?.name || "User";

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Welcome back, {userName}! 👋</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">See Latest Products</h2>
              <p className="text-sm mb-4">Check out our latest products and get ready to take your fitness journey to the next level.</p>
              <button
                onClick={() => router.push("/products")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                View Products
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Group Workout</h2>
              <p className="text-sm mb-4">Get started with a group workout</p>
              <button
                onClick={() => router.push("/group-workouts")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Register for a Workout
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4"> My Subscriptions</h2>
              <p className="text-sm mb-4">Manage your subscriptions and view your subscription history.</p>
              <button
                onClick={() => router.push("/subscriptions")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                View Subscriptions
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">My Orders</h2>
              <p className="text-sm mb-4">View your order history and manage your orders.</p>
              <button
                onClick={() => router.push("/orders")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
