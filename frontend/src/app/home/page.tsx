"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import Cookies from "js-cookie"

export default function HomePage() {
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Fetch user data
    fetch("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Include cookies in the request
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.name)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error)
        Cookies.remove("token")
        router.push("/auth/login")
      })
  }, [router])

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Welcome back, {userName}! 👋</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
              <p className="text-sm mb-4">Track your fitness journey and see how far you've come.</p>
              <button
                onClick={() => router.push("/progress")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                View Progress
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
              <p className="text-sm mb-4">Get ready for your daily fitness routine.</p>
              <button
                onClick={() => router.push("/workouts")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Start Workout
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Nutrition Plan</h2>
              <p className="text-sm mb-4">Check your meal plan and track your nutrition.</p>
              <button
                onClick={() => router.push("/nutrition")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                View Plan
              </button>
            </div>

            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Community</h2>
              <p className="text-sm mb-4">Connect with other fitness enthusiasts.</p>
              <button
                onClick={() => router.push("/community")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

