"use client";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import { useEffect, useState } from "react";

export default function Home() {
  const tg = useTelegramWebApp();
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

  // Handle loading state for server-side rendering
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tg)
    return (
      <div style={{ color: "red", padding: 16 }}>
        Error: Not running inside Telegram WebApp.<br />
        Please open this app using your Telegram bot’s WebApp button.
      </div>
    );

  const user = tg.initDataUnsafe?.user;

  // Add troubleshooting information to the error message
  if (!user) {
    return (
      <div style={{ color: "orange", padding: 16 }}>
        <h3>Telegram WebApp detected, but no user data found</h3>
        <p>This could happen if:</p>
        <ul style={{ marginLeft: 20 }}>
          <li>The app wasn't launched properly from Telegram</li>
          <li>There's an issue with Telegram authentication</li>
          <li>Try using the /test command in the bot for diagnostics</li>
        </ul>
      </div>
    );
  }

  // Render the main content if everything is working
  return (
    <div style={{ color: "green", padding: 16 }}>
      Telegram context detected!<br />
      {user
        ? `Welcome, ${user.first_name || user.username || "user"}!`
        : "No user info found in Telegram context."}
    </div>
  );
}
