import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from '../lang/tr';
import en from '../lang/en';

export type Locale = 'en' | 'tr';

interface LocaleContextData {
  locale: Locale;
  isRtl: boolean;
  t: (key: string, params?: any) => string;
  setLocale: (locale: Locale) => Promise<void>;
  getCurrentLocale: () => Locale;
}

const LocaleContext = createContext<LocaleContextData>({} as LocaleContextData);

const LOCALE_STORAGE_KEY = '@LoyaltyApp:locale';

// Simple translation function
const getTranslation = (locale: Locale, key: string, params?: any): string => {
  const translations: Record<string, any> = locale === 'en' ? en : tr;

  // Handle nested keys with dot notation (e.g., "common.welcome")
  const keys = key.split('.');
  let translation = keys.reduce((obj, k) => obj?.[k], translations);

  // If translation not found, return the key
  if (!translation || typeof translation !== 'string') {
    return key;
  }

  // Simple parameter replacement
  if (params) {
    Object.keys(params).forEach(paramKey => {
      translation = translation.replace(`{${paramKey}}`, params[paramKey]);
    });
  }

  return translation;
};

const DEFAULT_LOCALE = 'tr';
export const LocaleProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    loadLocaleFromStorage();
  }, []);

  const loadLocaleFromStorage = async () => {
    try {
      const storedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      if (storedLocale && (storedLocale === 'en' || storedLocale === 'tr')) {
        setLocaleState(storedLocale as Locale);
      } else {
        // Default to Turkish for now, we'll add device locale detection later
        setLocaleState(DEFAULT_LOCALE);
      }
    } catch (error) {
      console.error('Error loading locale from storage:', error);
      setLocaleState(DEFAULT_LOCALE);
    }
  };

  const setLocale = async (newLocale: Locale) => {
    try {
      setLocaleState(newLocale);
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (error) {
      console.error('Error saving locale to storage:', error);
    }
  };

  const t = (key: string, params?: any): string => {
    return getTranslation(locale, key, params);
  };

  const getCurrentLocale = (): Locale => {
    return locale;
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        isRtl,
        t,
        setLocale,
        getCurrentLocale,
      }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextData => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
