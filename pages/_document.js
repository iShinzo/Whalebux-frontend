import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/placeholder-logo.png" />
        {/* Telegram WebApp JS SDK - using next/script for better loading strategy */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" nonce="telegram-webapp" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
