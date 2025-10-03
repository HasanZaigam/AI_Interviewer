"use client"

import { useState, useRef, useEffect } from "react"
// import { useRouter } from "next/navigation"
import { getCurrentUser, signOut } from "@/lib/actions/auth.action"
import { toast } from "sonner"
import Image from "next/image"

type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  // const router = useRouter()

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setIsOpen(false) // Close the panel first
      
      await signOut()
      toast.success("Successfully signed out")
      
      // Use window.location.href for a full page refresh to clear all state
      window.location.href = "/sign_in"
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Failed to sign out")
      setIsLoggingOut(false)
    }
  }

  // Don't render if user is not authenticated
  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse"></div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.name || 'User'}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {/* Right-side Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.name || 'User'}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {user.name || 'User'}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Panel Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Profile Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Full Name
                  </label>
                  <p className="text-white font-medium">
                    {user.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-white font-medium">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    User ID
                  </label>
                  <p className="text-gray-300 text-sm font-mono">
                    {user.id}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Add profile edit functionality here
                    toast.info("Profile editing coming soon!")
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Add settings functionality here
                    toast.info("Settings coming soon!")
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {isLoggingOut ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing out...
                </div>
              ) : (
                'Sign Out'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserAvatar
