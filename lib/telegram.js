// Telegram Web App initialization and utilities
export const initTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // Expand the web app to full size
    webApp.expand();
    
    // Set the app background color
    webApp.setBackgroundColor('#ffffff');
    
    // Set the app header color
    webApp.setHeaderColor('#ffffff');
    
    // Enable closing confirmation
    webApp.enableClosingConfirmation();
    
    return webApp;
  }
  return null;
};

// Get Telegram user data
export const getTelegramUser = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
};

// Get Telegram init data
export const getTelegramInitData = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
    return window.Telegram.WebApp.initData;
  }
  return null;
};

// Send data to Telegram
export const sendDataToTelegram = (data) => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    return true;
  }
  return false;
};

// Close the web app
export const closeTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
    return true;
  }
  return false;
};

// Check if running in Telegram
export const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}; 