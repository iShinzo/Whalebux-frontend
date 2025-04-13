"use client"

import { useState, useEffect } from "react"

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "")
  const [testUrl, setTestUrl] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set initial test URL
    setTestUrl(`${apiUrl.replace(/\/api$/, "")}/health`)
  }, [apiUrl])

  const testApi = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      console.log("Testing API at:", testUrl)
      const res = await fetch(testUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      console.log("Response status:", res.status, res.statusText)

      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json()
        setResponse({
          status: res.status,
          statusText: res.statusText,
          data: data,
        })
      } else {
        const text = await res.text()
        setResponse({
          status: res.status,
          statusText: res.statusText,
          data: text,
        })
      }
    } catch (err) {
      console.error("API test error:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">API Test Tool</h1>

        <div className="mb-4">
          <label htmlFor="apiUrl" className="block text-white mb-2">
            API Base URL (from environment):
          </label>
          <input
            type="text"
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="testUrl" className="block text-white mb-2">
            Test URL:
          </label>
          <input
            type="text"
            id="testUrl"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={testApi}
            disabled={loading}
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test API"}
          </button>

          <button
            onClick={() => setTestUrl(`${apiUrl.replace(/\/api$/, "")}/health`)}
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Health Check
          </button>

          <button
            onClick={() => setTestUrl(`${apiUrl}/users/123456789`)}
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Test User API
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded">
            <h3 className="font-bold text-red-400">Error:</h3>
            <p className="text-white">{error}</p>
          </div>
        )}

        {response && (
          <div className="mb-4">
            <h3 className="font-bold text-white mb-2">Response:</h3>
            <div className="p-3 bg-gray-700 rounded overflow-auto max-h-96">
              <p className="text-white mb-2">
                Status:{" "}
                <span className={response.status >= 200 && response.status < 300 ? "text-green-400" : "text-red-400"}>
                  {response.status} {response.statusText}
                </span>
              </p>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {typeof response.data === "object" ? JSON.stringify(response.data, null, 2) : response.data}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-4 text-gray-400 text-sm">
          <p>Use this tool to test your API endpoints and diagnose connection issues.</p>
          <p className="mt-2">Common endpoints to test:</p>
          <ul className="list-disc list-inside mt-1">
            <li>/health - Check if the backend is running</li>
            <li>/api/users/123456789 - Test user endpoint with a sample ID</li>
            <li>/api/tasks?userId=123456789 - Test tasks endpoint</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
