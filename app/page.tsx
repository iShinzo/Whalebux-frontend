"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../lib/telegram-init";
import { Dashboard } from "../components/dashboard/dashboard";

export default function Home() {
  const telegramWebApp = useTelegramWebApp();
  const [isClient, setIsClient] = useState(false);
  const [forceLoad, setForceLoad] = useState(false);

  useEffect(() => {
    // Mark as rendered on the client
    setIsClient(true);

    console.log("Page component mounted");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    // Check for forceLoad query parameter
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("forceLoad") === "true") {
        setForceLoad(true);
      }

      if (window.Telegram?.WebApp) {
        console.log("Running inside Telegram WebApp");
        window.Telegram.WebApp.ready(); // Signal the Telegram WebApp is ready
      } else {
        console.log("Not running inside Telegram WebApp");
      }
    }
  }, []);

  // Handle loading state for server-side rendering
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle fallback when not in Telegram and forceLoad is not enabled
  if (!telegramWebApp && !forceLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">WhaleBux</h1>
        <p className="text-white mb-4">This app is designed to run inside Telegram.</p>
        <p className="text-white mb-4">Please open it from your Telegram bot.</p>

        {/* For development/testing, add a button to load the app */}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => {
            // Reload the page with forceLoad=true query parameter
            window.location.href = `${window.location.pathname}?forceLoad=true`;
          }}
        >
          Load App Anyway (Development Only)
        </button>
      </div>
    );
  }

  // Render the Dashboard if Telegram WebApp is detected or forceLoad is enabled
  return <Dashboard />;
}