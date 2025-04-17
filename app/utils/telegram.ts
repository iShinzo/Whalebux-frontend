export function initializeTelegramWebApp() {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      return tg; // Return the Telegram WebApp instance
    } else {
      console.error("Not running inside Telegram WebApp!");
      return null;
    }
  }