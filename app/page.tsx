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
    setIsClient(true);

    console.log("Page component mounted");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    if (typeof window !== "undefined") {
      if (window.Telegram?.WebApp) {
        console.log("Running inside Telegram WebApp");
        window.Telegram.WebApp.ready(); // Signal the Telegram WebApp is ready
      } else {
        console.log("Not running inside Telegram WebApp");
      }
    }
  }, []);

  // Handle loading state for server-side rendering or Telegram WebApp
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);
  
  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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


  // Only allow running inside Telegram WebApp
  if (!webApp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">WhaleBux</h1>
        <p className="text-white mb-4">This app is designed to run inside Telegram.</p>
        <p className="text-white mb-4">Please open it from your Telegram bot.</p>
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
  // If everything is good, render your dashboard/app
  return <Dashboard />;
}
