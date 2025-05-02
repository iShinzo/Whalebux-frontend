import { useState, useEffect } from 'react';
import { userApi } from './api-service';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initData: string;
  initDataUnsafe?: {
    user?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
      photo_url?: string;
    };
  };
}

interface UserData {
  userId: string;
  telegramId: number | null;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  wbuxBalance?: number;
  level?: number;
  referralCode?: string;
  referralCount?: number;
  miningRateLevel?: number;
}

interface TelegramWebAppHook {
  webApp: TelegramWebApp | null;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

export function useTelegramWebApp(): TelegramWebAppHook {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      setError('This hook must run in a browser environment.');
      return;
    }

    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 500; // ms

    const checkTelegramWebApp = () => {
      console.log(`Checking for Telegram WebApp (attempt ${retryCount + 1}/${maxRetries})...`);

      // Check if we're in a Telegram WebApp environment
      if (window.Telegram?.WebApp) {
        console.log('Telegram WebApp detected, initializing...');
        initTelegram();
      } else if (retryCount < maxRetries - 1) {
        // Retry with increasing delay
        retryCount++;
        console.log(`Telegram WebApp not found, retrying in ${retryDelay * retryCount}ms...`);
        setTimeout(checkTelegramWebApp, retryDelay * retryCount);
      } else {
        // Give up after max retries
        console.error('Not running in Telegram WebApp environment after multiple attempts');
        setLoading(false);
        setError('Please open this app through Telegram.');
      }
    };

    // Start checking for Telegram WebApp
    checkTelegramWebApp();

    const initTelegram = async () => {
      try {
        console.log('Initializing Telegram WebApp...');

        const telegramWebApp = window.Telegram?.WebApp as TelegramWebApp;
        if (!telegramWebApp) {
          throw new Error('Telegram WebApp not found');
        }

        // Initialize Telegram WebApp
        telegramWebApp.ready();
        telegramWebApp.expand();

        // Get user data from Telegram
        const initData = telegramWebApp.initDataUnsafe;
        const telegramUser = initData?.user;

        if (!telegramUser) {
          console.log('No Telegram user data found.');
          setError('No Telegram user data available.');
          return;
        }

        const telegramId = telegramUser.id;
        console.log('Telegram user data:', telegramUser);

        try {
          // Fetch user data from API
          const userData = await userApi.getUserData(telegramId);
          console.log('User data fetched from API:', userData);
          setUser({
            userId: userData.userId,
            telegramId: userData.telegramId ?? telegramId,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            photoUrl: telegramUser.photo_url,
          });
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);

          // Handle 404 (user not found) by creating a new user
          if (fetchError instanceof Error && fetchError.message.includes('404')) {
            console.log('User not found in database, creating new user...');
            try {
              const newUser = await userApi.createUser({
                telegramId,
                username: telegramUser.username || `user_${telegramId}`,
                firstName: telegramUser.first_name || '',
                lastName: telegramUser.last_name || '',
              });
              console.log('New user created successfully:', newUser);
              setUser({
                userId: newUser.userId,
                telegramId: newUser.telegramId ?? telegramId,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                photoUrl: telegramUser.photo_url,
              });
            } catch (createError) {
              console.error('Error creating new user:', createError);
              setError(
                `Failed to create user: ${
                  createError instanceof Error ? createError.message : String(createError)
                }`,
              );
            }
          } else {
            setError(
              `Failed to fetch user data: ${
                fetchError instanceof Error ? fetchError.message : String(fetchError)
              }`,
            );
          }
        }

        setWebApp(telegramWebApp);
      } catch (err) {
        console.error('Error initializing Telegram WebApp:', err);
        setError(
          `Error initializing Telegram WebApp: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      } finally {
        setLoading(false);
      }
    };

    initTelegram();
  }, []);

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      // Update the Zustand user store with backend/Telegram data
      const {
        userId,
        telegramId,
        username,
        firstName,
        lastName,
        photoUrl,
        wbuxBalance = 100.0,
        level = 1,
        referralCode = `REF_${user.telegramId}`,
        referralCount = 0,
        miningRateLevel = 0,
      } = user;

      // Use dynamic import for the store to avoid circular dependencies
      import('./stores/userStore').then(({ useUserStore }) => {
        useUserStore.setState({
          userId,
          telegramId,
          username,
          firstName,
          lastName,
          photoUrl,
          wbuxBalance,
          level,
          referralCode,
          referralCount,
          miningRateLevel,
        });
      });
    }
  }, [user]);

  return { webApp, user, loading, error };
}