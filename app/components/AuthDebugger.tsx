"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { toast } from "sonner"

const AuthDebugger = () => {
  const [email, setEmail] = useState("hasan.13519011722@ipu.ac.in")
  const [password, setPassword] = useState("hasan@12")
  const [isLoading, setIsLoading] = useState(false)

  const testSignUp = async () => {
    setIsLoading(true)
    try {
      console.log("Testing sign up with:", { email, password })
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log("Sign up successful:", userCredential.user)
      toast.success("Account created successfully!")
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast.error(`Sign up failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSignIn = async () => {
    setIsLoading(true)
    try {
      console.log("Testing sign in with:", { email, password })
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful:", userCredential.user)
      toast.success("Sign in successful!")
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast.error(`Sign in failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Auth Debugger</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={testSignUp}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Sign Up
          </button>
          <button
            onClick={testSignIn}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthDebugger