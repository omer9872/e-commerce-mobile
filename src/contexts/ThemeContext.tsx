'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';

import {colors} from '../theme/colors';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextData {
  theme: Theme;
  isDark: boolean;
  colors: typeof colors.light;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@LoyaltyApp:theme';

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  useEffect(() => {
    updateThemeColors();
  }, [theme, systemColorScheme]);

  const loadThemeFromStorage = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        setThemeState(storedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme from storage:', error);
    }
  };

  const updateThemeColors = () => {
    let shouldUseDark = false;

    switch (theme) {
      case 'dark':
        shouldUseDark = true;
        break;
      case 'light':
        shouldUseDark = false;
        break;
      case 'system':
      default:
        shouldUseDark = systemColorScheme === 'dark';
        break;
    }

    setIsDark(shouldUseDark);
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        colors: currentColors,
        setTheme,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 