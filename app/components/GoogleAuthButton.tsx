"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signInWithGoogle } from "@/lib/actions/auth.action"
import { toast } from "sonner"
import Image from "next/image"

const GoogleAuthButton = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Get the callback URL from search params, default to home page
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleGoogleSignIn = async () => {
    console.log("Starting Google sign-in...")
    setIsLoading(true)
    
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      console.log("Initiating popup to Google...")
      const result = await signInWithPopup(auth, provider)
      console.log("Popup result:", result)
      
      const user = result.user
      console.log("User from popup:", user)
      
      const idToken = await user.getIdToken()
      console.log("ID token obtained")
      
      console.log("Calling signInWithGoogle with:", {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        idToken: idToken.substring(0, 20) + '...'
      })
      
      const response = await signInWithGoogle({
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        idToken
      })

      console.log("SignInWithGoogle response:", response)

      if (response.success) {
        toast.success("Successfully signed in with Google!")
        console.log("Redirecting to:", callbackUrl)
        window.location.href = callbackUrl
      } else {
        toast.error(response.message || "Failed to sign in with Google")
      }
    } catch (error: unknown) {
      console.error("Google sign-in error:", error)
      
      // Handle specific Google auth errors
      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as { code: string; message?: string }
        if (authError.code === 'auth/popup-closed-by-user') {
          toast.error("Sign-in was cancelled. Please try again.")
        } else if (authError.code === 'auth/popup-blocked') {
          toast.error("Popup was blocked. Please allow popups and try again.")
        } else if (authError.code === 'auth/network-request-failed') {
          toast.error("Network error. Please check your connection and try again.")
        } else if (authError.code === 'auth/unauthorized-domain') {
          toast.error("Domain not authorized. Please contact support.")
        } else if (authError.code === 'auth/operation-not-allowed') {
          toast.error("Google sign-in is not enabled. Please contact support.")
        } else {
          toast.error(authError.message || "Failed to sign in with Google")
        }
      } else {
        toast.error("Failed to sign in with Google")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      <Image
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        width={20}
        height={20}
      />
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </button>
  )
}

export default GoogleAuthButton
