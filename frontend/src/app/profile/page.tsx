"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import { FiEdit2, FiSave, FiCamera, FiTrash2 } from "react-icons/fi"
import Cookies from "js-cookie"

interface UserProfile {
  name: string
  lastname: string
  email: string
  city: string
  address: string
  postalcode: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    lastname: "",
    email: "",
    city: "",
    address: "",
    postalcode: "",
  })

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        Cookies.remove("token")
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSave = async () => {
    const token = Cookies.get("token")
    if (!token) return

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    const token = Cookies.get("token")
    if (!token) return

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      Cookies.remove("token")
      router.push("/auth/login")
    } catch (error) {
      console.error("Failed to delete account:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`max-w-4xl mx-auto rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="relative mb-8">
          <div className="h-40 w-full rounded-t-lg bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  <FiCamera size={32} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`p-2 rounded-lg flex items-center gap-2 ${isEditing ? "bg-green-500 hover:bg-green-600" : "bg-purple-600 hover:bg-purple-700"} text-white transition-colors`}
            >
              {isEditing ? (
                <>
                  <FiSave /> Save
                </>
              ) : (
                <>
                  <FiEdit2 /> Edit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      value={profile.lastname}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {profile.name} {profile.lastname}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Address Information</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalcode"
                      value={profile.postalcode}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">City:</span> {profile.city}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {profile.address}
                  </p>
                  <p>
                    <span className="font-medium">Postal Code:</span> {profile.postalcode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delete Account Button */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              <FiTrash2 /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

