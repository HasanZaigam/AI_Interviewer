"use client"

import { useEffect, useState } from "react"
import { auth } from "@/firebase/client"
import { onAuthStateChanged, User } from "firebase/auth"

const FirebaseTest = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user)
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-4 border rounded">
      <h3>Firebase Auth Test</h3>
      <p>Current user: {user ? user.email : "Not signed in"}</p>
      <p>Auth domain: {auth.config.authDomain}</p>
      <p>App name: {auth.app.name}</p>
    </div>
  )
}

export default FirebaseTest
