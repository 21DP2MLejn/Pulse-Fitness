"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any; // For any additional user properties
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to get the current token
  const getToken = (): string | null => {
    // Try to get token from cookie first
    const cookieToken = Cookies.get("token");
    if (cookieToken) {
      return cookieToken;
    }
    
    // If not in cookie, try localStorage
    const localToken = localStorage.getItem('authToken');
    if (localToken) {
      // If found in localStorage but not in cookie, restore the cookie
      console.log("Token found in localStorage but not in cookie, restoring cookie");
      Cookies.set("token", localToken, { 
        expires: 7,
        path: '/',
        sameSite: 'lax'
      });
      return localToken;
    }
    
    return null;
  };

  const login = (token: string, userData?: any) => {
    console.log("Setting token in cookie:", token);
    // Set the token with proper options for better persistence
    Cookies.set("token", token, { 
      expires: 7, // 7 days
      path: '/',
      sameSite: 'lax'
    });
    
    // Also store in localStorage for redundancy
    localStorage.setItem('authToken', token);
    
    if (userData) {
      console.log("Setting user data from login response:", userData);
      setUser(userData);
      // Also store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      // If no user data provided, fetch it
      refreshUser();
    }
  };

  const logout = () => {
    Cookies.remove("token", { path: '/' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    router.push("/auth/login");
  };

  const refreshUser = async () => {
    const token = getToken();
    console.log("Token from cookie or localStorage:", token);
    
    if (!token) {
      // Try to recover from localStorage if cookie is missing
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          console.log("Recovered user data from localStorage:", parsedUserData);
          setUser(parsedUserData);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
          localStorage.removeItem('userData');
        }
      }
      
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching user data with token:", token);
      const response = await fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log("User API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data received:", data);
      
      // Check if the response has the expected structure
      if (data.status === true && data.user) {
        setUser(data.user);
        // Update localStorage with latest user data
        localStorage.setItem('userData', JSON.stringify(data.user));
      } else if (data.status === false) {
        console.error("API returned error:", data.message);
        throw new Error(data.message || "Failed to fetch user data");
      } else {
        // Handle legacy API response format
        setUser(data);
        localStorage.setItem('userData', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      // Only clear on auth errors (401)
      if (error instanceof Error && error.message.includes("401")) {
        Cookies.remove("token", { path: '/' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
      } else {
        // For other errors, try to use cached user data
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            setUser(JSON.parse(storedUserData));
          } catch (e) {
            console.error("Failed to parse stored user data:", e);
            localStorage.removeItem('userData');
            setUser(null);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthContext mounted, checking token");
    refreshUser();
    
    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Failed to parse user data from storage event:", error);
          }
        } else {
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
