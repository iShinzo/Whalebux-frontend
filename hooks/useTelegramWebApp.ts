import { useEffect, useState } from "react";

// Use typeof only if window.Telegram and window.Telegram.WebApp are defined
let tgType: any = undefined;
if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
  tgType = window.Telegram.WebApp;
}
type TelegramWebApp = typeof tgType;

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  return webApp;
}