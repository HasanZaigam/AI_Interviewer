// "use client"

// import { useEffect, useState } from "react"
// import { auth } from "@/firebase/client"

// const FirebaseConfigChecker = () => {
//   const [config, setConfig] = useState<any>(null)

//   useEffect(() => {
//     const checkConfig = () => {
//       try {
//         const authConfig = auth.config
//         setConfig({
//           apiKey: authConfig.apiKey ? "✅ Set" : "AIzaSyBqwG82VhfrsgULQJRTzA-vUdRTzDfKmao",
//           authDomain: authConfig.authDomain || "ai-interviewer-f86b9.firebaseapp.com",
//           projectId: authConfig.projectId || "ai-interviewer-f86b9",
//           appId: authConfig.appId || "1:637227218047:web:d53359c4d375ff677a3b4a",
//         })
//       } catch (error) {
//         console.error("Error checking Firebase config:", error)
//         setConfig({ error: "Failed to load config" })
//       }
//     }

//     checkConfig()
//   }, [])

//   if (!config) {
//     return <div className="p-4 border rounded">Loading Firebase config...</div>
//   }

//   return (
//     <div className="p-4 border rounded-lg bg-yellow-50">
//       <h3 className="text-lg font-semibold mb-2">Firebase Configuration</h3>
//       <div className="space-y-1 text-sm">
//         <div>API Key: {config.apiKey}</div>
//         <div>Auth Domain: {config.authDomain}</div>
//         <div>Project ID: {config.projectId}</div>
//         <div>App ID: {config.appId}</div>
//         {config.error && <div className="text-red-600">Error: {config.error}</div>}
//       </div>
//     </div>
//   )
// }

// export default FirebaseConfigChecker



"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  error?: string;
}

const FirebaseConfigChecker = () => {
  const [config, setConfig] = useState<FirebaseConfig | null>(null);

  useEffect(() => {
    const checkConfig = () => {
      try {
        const authConfig = auth.config;

        setConfig({
          apiKey: authConfig.apiKey ? "✅ Set" : "AIzaSyBqwG82VhfrsgULQJRTzA-vUdRTzDfKmao",
          authDomain: authConfig.authDomain || "ai-interviewer-f86b9.firebaseapp.com",
          projectId: auth.app.options.projectId || "ai-interviewer-f86b9",
          appId: auth.app.options.appId || "1:637227218047:web:d53359c4d375ff677a3b4a",
        });
      } catch (error: unknown) {
        console.error("Error checking Firebase config:", error);
        setConfig({
          apiKey: "Unknown",
          authDomain: "Unknown",
          projectId: "Unknown",
          appId: "Unknown",
          error: "Failed to load config",
        });
      }
    };

    checkConfig();
  }, []);

  if (!config) {
    return <div className="p-4 border rounded">Loading Firebase config...</div>;
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
  );
};

export default FirebaseConfigChecker;
