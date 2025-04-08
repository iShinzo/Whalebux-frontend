"use client"

import { useState, useEffect } from "react"

export default function CorsTestPage() {
  const [status, setStatus] = useState<string>("Testing...")
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testCors = async () => {
      try {
        setStatus("Testing CORS connection...")
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://whalebux-backend.onrender.com/api"
        const corsTestUrl = `${apiUrl.replace(/\/api$/, "")}/cors/test`
        
        console.log("Testing CORS with URL:", corsTestUrl)
        
        const response = await fetch(corsTestUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        })
        
        console.log("CORS test response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("CORS test data:", data)
          setResponse(data)
          setStatus("CORS test successful!")
        } else {
          setStatus(`CORS test failed: ${response.status} ${response.statusText}`)
          setError(`HTTP error: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error("CORS test error:", error)
        setStatus("CORS test failed with error")
        setError(error instanceof Error ? error.message : String(error))
      }
    }

    testCors()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">CORS Test</h1>
        
        <div className="mb-4 p-3 bg-gray-700 rounded">
          <p className="text-white font-semibold">Status:</p>
          <p className={`${status.includes("successful") ? "text-green-400" : "text-yellow-400"}`}>
            {status}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded">
            <h3 className="font-bold text-red-400">Error:</h3>
            <p className="text-white">{error}</p>
          </div>
        )}
        
        {response && (
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <h3 className="font-bold text-white mb-2">Response:</h3>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4 text-gray-400 text-sm">
          <p>This page tests CORS connectivity with your backend.</p>
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL || "https://whalebux-backend.onrender.com/api"}</p>
        </div>
      </div>
    </div>
  )
}
