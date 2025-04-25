'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTelegramWebApp } from '../lib/telegram-init';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { webApp, loading, error } = useTelegramWebApp();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Telegram WebApp
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
      }
    }
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp; 