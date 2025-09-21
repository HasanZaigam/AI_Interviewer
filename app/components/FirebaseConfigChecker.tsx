"use client"

import { useEffect, useState } from "react"
import { auth } from "@/firebase/client"

const FirebaseConfigChecker = () => {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const checkConfig = () => {
      try {
        const authConfig = auth.config
        setConfig({
          apiKey: authConfig.apiKey ? "✅ Set" : "❌ Missing",
          authDomain: authConfig.authDomain || "❌ Missing",
          projectId: authConfig.projectId || "❌ Missing",
          appId: authConfig.appId || "❌ Missing",
        })
      } catch (error) {
        console.error("Error checking Firebase config:", error)
        setConfig({ error: "Failed to load config" })
      }
    }

    checkConfig()
  }, [])

  if (!config) {
    return <div className="p-4 border rounded">Loading Firebase config...</div>
  }

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h3 className="text-lg font-semibold mb-2">Firebase Configuration</h3>
      <div className="space-y-1 text-sm">
        <div>API Key: {config.apiKey}</div>
        <div>Auth Domain: {config.authDomain}</div>
        <div>Project ID: {config.projectId}</div>
        <div>App ID: {config.appId}</div>
        {config.error && <div className="text-red-600">Error: {config.error}</div>}
      </div>
    </div>
  )
}

export default FirebaseConfigChecker
