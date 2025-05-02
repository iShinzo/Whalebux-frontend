import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import "../styles/globals.css";

export default function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  useTelegramWebApp(); // Still initialize the hook for context
  return <Component {...pageProps} />;
}