import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Add favicon */}
        <link rel="icon" type="image/png" href="/placeholder-logo.png" />
        {/* Telegram WebApp script */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
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