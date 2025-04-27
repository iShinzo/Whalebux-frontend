"use client";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

export default function Home() {
  const tg = useTelegramWebApp();

  if (!tg)
    return (
      <div style={{ color: "red", padding: 16 }}>
        Error: Not running inside Telegram WebApp.<br />
        Please open this app using your Telegram bot’s WebApp button.
      </div>
    );

  const user = tg.initDataUnsafe?.user;

  return (
    <div style={{ color: "green", padding: 16 }}>
      Telegram context detected!<br />
      {user
        ? `Welcome, ${user.first_name || user.username || "user"}!`
        : "No user info found in Telegram context."}
    </div>
  );
}
