import { useEffect } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  useEffect(() => {
    // Check if Telegram WebApp is available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready(); // Notify Telegram that the WebApp is ready
      console.log("Telegram WebApp initialized");
      console.log("Init Data:", tg.initData); // Access Telegram WebApp data here
    } else {
      console.error("Not running inside Telegram WebApp!");
    }
  }, []);

  return <Component {...pageProps} />;
}