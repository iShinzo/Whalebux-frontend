"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../lib/telegram-init";
import { Dashboard } from "../components/dashboard/dashboard";
import Script from "next/script";

export default function Home() {
  const { webApp, user, loading, error } = useTelegramWebApp();
  const [isClient, setIsClient] = useState(false);
  const [forceLoad, setForceLoad] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);

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

      // Check for saved Telegram user in localStorage
      const savedUser = localStorage.getItem("telegramUser");
      if (savedUser) {
        setTelegramUser(JSON.parse(savedUser));
      }
    }
  }, []);

  // Telegram login callback
  function onTelegramAuth(user: any) {
    localStorage.setItem("telegramUser", JSON.stringify(user));
    setTelegramUser(user);
    alert(
      "Logged in as " +
        user.first_name +
        " " +
        user.last_name +
        " (" +
        user.id +
        (user.username ? ", @" + user.username : "") +
        ")"
    );
  }

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

  // Show Telegram login widget if not in Telegram WebApp, not forceLoad, and not already logged in
  if (!webApp && !forceLoad && !telegramUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">WhaleBux</h1>
        <p className="text-white mb-4">Login with Telegram to continue.</p>
        <div id="telegram-login-widget" className="mb-4"></div>
        <Script
          src="https://telegram.org/js/telegram-widget.js?22"
          strategy="afterInteractive"
          onReady={() => {
            // @ts-ignore
            window.onTelegramAuth = onTelegramAuth;
          }}
        />
        <Script id="telegram-login-callback" strategy="afterInteractive">
          {`
            if (!document.getElementById('telegram-login-script')) {
              var script = document.createElement('script');
              script.id = 'telegram-login-script';
              script.async = true;
              script.src = 'https://telegram.org/js/telegram-widget.js?22';
              script.setAttribute('data-telegram-login', 'ReferralHelperBot');
              script.setAttribute('data-size', 'large');
              script.setAttribute('data-onauth', 'onTelegramAuth(user)');
              script.setAttribute('data-request-access', 'write');
              document.getElementById('telegram-login-widget').appendChild(script);
            }
          `}
        </Script>
      </div>
    );
  }

  // Handle fallback when not in Telegram and forceLoad is not enabled
  if (!webApp && !forceLoad) {
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