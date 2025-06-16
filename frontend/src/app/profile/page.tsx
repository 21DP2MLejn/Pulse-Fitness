"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"
import { FiEdit2, FiSave, FiCamera, FiTrash2 } from "react-icons/fi"
import Cookies from "js-cookie"
import ConfirmModal from "@/components/ConfirmModal"
import { useLanguage } from '@/context/LanguageContext'
import { API_URL } from '@/config/api'

interface UserProfile {
  name: string
  lastname: string
  email: string
  city: string
  address: string
  postalcode: string
  phone: string
  subscription_name?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user, isAuthenticated, isLoading, logout, getToken } = useAuth()
  const { t } = useLanguage()
  const isDark = theme === "dark"

  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    lastname: "",
    email: "",
    city: "",
    address: "",
    postalcode: "",
    phone: "",
    subscription_name: "",
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user) {
      setProfile({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        city: user.city || "",
        address: user.address || "",
        postalcode: user.postalcode || "",
        phone: user.phone || "",
        subscription_name: user.subscription_name || "",
      })
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  const handleSave = async () => {
    console.log("Save button clicked");
    setSaveError(null);
    
    const token = getToken();
    console.log("Token from auth context:", token);
    
    if (!token) {
      const localToken = localStorage.getItem('authToken');
      console.log("Trying to get token directly from localStorage:", localToken);
      
      if (localToken) {
        try {
          console.log("Sending profile update with localStorage token");
          const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localToken}`,
            },
            credentials: "include",
            body: JSON.stringify(profile),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("Profile update successful with localStorage token:", data);
            
            if (data.user) {
              setProfile({
                name: data.user.name || "",
                lastname: data.user.lastname || "",
                email: data.user.email || "",
                city: data.user.city || "",
                address: data.user.address || "",
                postalcode: data.user.postalcode || "",
                phone: data.user.phone || "",
                subscription_name: data.user.subscription_name || "",
              });
            }
            
            setIsEditing(false);
            return;
          }
        } catch (error) {
          console.error("Failed to update with localStorage token:", error);
        }
      }
      
      console.log("No token available, cannot proceed with update");
      setSaveError("Authentication token missing. Please try logging in again.");
      return;
    }

    try {
      console.log("Sending profile update:", profile);
      
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(profile),
      });

      console.log("Profile update response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Profile update failed:", errorText);
        setSaveError("Failed to update profile. Please try logging in again.");
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Profile update response data:", data);
      
      if (data.user) {
        setProfile({
          name: data.user.name || "",
          lastname: data.user.lastname || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          city: data.user.city || "",
          address: data.user.address || "",
          postalcode: data.user.postalcode || "",
          subscription_name: data.user.subscription_name || "",
        });
      }

      setSaveError(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const token = getToken();
    if (!token) {
      setSaveError("Authentication token missing. Please try logging in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`max-w-4xl mx-auto rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {saveError}
          </div>
        )}
        {/* Top section with gradient background and edit/save button, but no profile picture */}
        <div className="relative mb-8">
          <div className="h-40 w-full rounded-t-lg bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                isEditing ? handleSave() : setIsEditing(true);
              }}
              className={`p-2 rounded-lg flex items-center gap-2 ${isEditing ? "bg-green-500 hover:bg-green-600" : "bg-purple-600 hover:bg-purple-700"} text-white transition-colors`}
            >
              {isEditing ? (
                <>
                  <FiSave /> {t('profile.save')}
                </>
              ) : (
                <>
                  <FiEdit2 /> {t('profile.editProfile')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('profile.personalInfo')}</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.firstName')}</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.lastName')}</label>
                    <input
                      type="text"
                      name="lastname"
                      value={profile.lastname}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                      disabled
                    />
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t('profile.emailCannotChange')}</p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                      placeholder="e.g. +1 234 567 8900"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('auth.firstName')}: </span>
                    {profile.name} {profile.lastname}
                  </p>
                  <p>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('auth.email')}: </span>
                    {profile.email}
                  </p>
                  <p>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('auth.phone')}: </span>
                    {profile.phone || t('profile.notProvided')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t('profile.addressInfo')}</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.city')}</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.address')}</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : ""}`}>{t('auth.postalcode')}</label>
                    <input
                      type="text"
                      name="postalcode"
                      value={profile.postalcode}
                      onChange={handleChange}
                      className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('auth.city')}: </span>
                    {profile.city}
                  </p>
                  <p>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('auth.address')}: </span>
                    {profile.address}
                  </p>
                  <p>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('auth.postalcode')}: </span>
                    {profile.postalcode}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t('profile.subscription')}</h2>
              <div className="space-y-2">
                <p>
                  <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t('profile.subscriptionName')}: </span>
                  {profile.subscription_name || t('profile.noActiveSubscription')}
                </p>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FiTrash2 /> {t('profile.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t('profile.deleteAccount')}
        message={t('profile.deleteAccountMessage')}
        confirmText={t('profile.deleteAccount')}
        cancelText={t('profile.cancel')}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
