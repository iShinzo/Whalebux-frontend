import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import "../styles/globals.css";

export default function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  const tg = useTelegramWebApp();

  return (
    <>
      {/* Telegram Debug Info (remove or hide in production) */}
      {!tg ? (
        <div style={{ color: 'red', padding: 8 }}>Not running inside Telegram WebApp.</div>
      ) : (
        <div style={{ color: 'green', padding: 8 }}>
          Telegram Context Detected!<br />
          <pre style={{ color: 'inherit', background: '#222', padding: 8, borderRadius: 6 }}>
            {JSON.stringify(tg.initDataUnsafe?.user, null, 2)}
          </pre>
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}