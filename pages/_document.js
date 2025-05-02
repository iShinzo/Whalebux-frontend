import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Add favicon */}
        <link rel="icon" type="image/png" href="/placeholder-logo.png" />
        {/* Telegram WebApp script - updated to latest version without version parameter */}
        <script src="https://telegram.org/js/telegram-web-app.js" nonce="telegram-webapp"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}