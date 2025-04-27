import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Add favicon */}
        <link rel="icon" type="image/png" href="/placeholder-logo.png" />
        {/* Telegram WebApp script */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        {/* Debug: Log Telegram context as soon as possible */}
        <Script id="tg-debug" strategy="beforeInteractive">
          {`
            window.addEventListener('DOMContentLoaded', function() {
              console.log('TG DEBUG: window.Telegram =', window.Telegram);
              console.log('TG DEBUG: window.Telegram.WebApp =', window.Telegram?.WebApp);
              console.log('TG DEBUG: window.location.href =', window.location.href);
            });
          `}
        </Script>
        {/* Vercel Live Feedback script allow (optional for dev) */}
        {/* <script src="https://vercel.live/_next-live/feedback/feedback.js" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
