"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../lib/telegram-init";
import { Dashboard } from "../components/dashboard/dashboard";
import Script from "next/script";
import { ClientHeader } from "../components/ui/ClientHeader";

export default function Home() {
  const { webApp, user, loading, error } = useTelegramWebApp();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as rendered on the client
    setIsClient(true);

    console.log("Page component mounted");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    // Check for Telegram WebApp with retry mechanism
    let retryCount = 0;
    const maxRetries = 5;

    const checkTelegramWebApp = () => {
      if (typeof window !== "undefined") {
        if (window.Telegram?.WebApp) {
          console.log("Running inside Telegram WebApp");
          try {
            window.Telegram.WebApp.ready(); // Signal the Telegram WebApp is ready
            window.Telegram.WebApp.expand(); // Expand the WebApp to full height
            console.log("Telegram WebApp initialized successfully");
          } catch (error) {
            console.error("Error initializing Telegram WebApp:", error);
          }
        } else if (retryCount < maxRetries) {
          console.log(`Not running inside Telegram WebApp (attempt ${retryCount + 1}/${maxRetries})`);
          retryCount++;
          setTimeout(checkTelegramWebApp, 500 * retryCount);
        } else {
          console.error("Telegram WebApp not detected after multiple attempts");
        }
      }
    };

    checkTelegramWebApp();
  }, []);

  // Handle loading state for server-side rendering or Telegram WebApp
  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error if Telegram WebApp is not detected or hook returns error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-4">Error</h1>
        <p className="text-muted-foreground mb-4 text-center">{error}</p>
        <p className="text-muted-foreground mt-2 text-center">
          Please ensure this app is opened via your Telegram bot's WebApp link or button.
        </p>
      </div>
    );
  }

  // Show message if not in Telegram WebApp
  if (!webApp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">WhaleBux</h1>
        <p className="text-white mb-4">This app is designed to run inside Telegram.</p>
        <p className="text-white mb-4">Please open it from your Telegram bot.</p>
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">Troubleshooting:</p>
          <ul className="text-gray-300 list-disc pl-5 space-y-1">
            <li>Make sure you're opening this app from the Telegram bot</li>
            <li>Try using the /test command in the bot for a diagnostic test</li>
            <li>Check if JavaScript is enabled in your browser</li>
            <li>Try clearing your browser cache</li>
          </ul>
        </div>
      </div>
    );
  }

  // Render the Dashboard if Telegram WebApp is detected
  return (
    <>
      <ClientHeader />
      <Dashboard />
    </>
  );
}
