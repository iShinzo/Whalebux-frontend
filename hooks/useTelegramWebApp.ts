import { useEffect, useState } from "react";

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  // Add more properties as needed from Telegram WebApp API
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  return webApp;
}