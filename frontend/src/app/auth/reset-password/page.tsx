"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/context/ThemeContext"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    const emailParam = searchParams.get("email")
    
    if (tokenParam) setToken(tokenParam)
    if (emailParam) setEmail(emailParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    if (password !== passwordConfirmation) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      console.log("Resetting password for:", { email, token });
      
      const response = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          token, 
          password,
          password_confirmation: passwordConfirmation
        }),
      })

      const data = await response.json()
      console.log("Password reset response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      setMessage("Your password has been reset successfully. You can now login with your new password.")
      
      
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err instanceof Error ? err.message : "An error occurred while resetting password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <h1 className="text-3xl font-bold text-center mb-6">Reset Your Password</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              required
              readOnly={!!searchParams.get("email")}
            />
          </div>

          <div className="hidden">
            <input
              type="hidden"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              required
              minLength={8}
            />
            <p className="text-xs mt-1 text-gray-500">Password must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="password-confirmation" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              id="password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
