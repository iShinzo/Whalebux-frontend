const isDev = process.env.NODE_ENV === 'development';

export const APP_CONFIG = {
  // API URLs
  api: {
    baseUrl: isDev 
      ? 'http://localhost:8080' 
      : 'https://whalebux-vercel.onrender.com',
    endpoints: {
      users: '/api/users',
      tasks: '/api/tasks',
      telegram: '/api/telegram'
    }
  },

  // Telegram Web App configuration
  telegram: {
    botUsername: 'WhaleBuxBot', // Your bot's username
    webAppUrl: isDev
      ? 'http://localhost:3000'
      : 'https://whalebux-frontend.vercel.app',
    initData: null, // Will be set by Telegram.WebApp
    themeParams: null, // Will be set by Telegram.WebApp
    version: '6.0' // Minimum required version
  },

  // App settings
  app: {
    name: 'WhaleBux',
    version: '1.0.0',
    description: 'WhaleBux Telegram Mini App',
    theme: {
      primary: '#3B82F6',
      secondary: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  },

  // Feature flags
  features: {
    enableTelegramAuth: true,
    enableWebApp: true,
    enableNotifications: true
  }
}; 