"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../lib/telegram-init";
import { Dashboard } from "../components/dashboard/dashboard";

export default function Home() {
  const { webApp, user, loading, error } = useTelegramWebApp();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
      </div>
    );
  }

  // If everything is good, render your dashboard/app
  return <Dashboard />;
}