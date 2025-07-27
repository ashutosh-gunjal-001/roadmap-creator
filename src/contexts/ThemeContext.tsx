import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theme, ThemeContextType } from '../types';

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  isDarkMode: false,
});

// Storage key
const THEME_STORAGE_KEY = 'roadmap-creator-theme';

// Helper to detect system theme preference
const getSystemThemePreference = (): 'light' | 'dark' => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Initialize theme from localStorage or default to system
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as Theme) || 'system';
  });
  
  // Track whether the current applied theme is dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return getSystemThemePreference() === 'dark';
  });

  // Apply theme changes to the document and localStorage
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Determine if we should apply dark mode
    let shouldApplyDark = theme === 'dark';
    
    if (theme === 'system') {
      shouldApplyDark = getSystemThemePreference() === 'dark';
    }
    
    // Apply the appropriate class to the document
    if (shouldApplyDark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    
    // Update the isDarkMode state
    setIsDarkMode(shouldApplyDark);
  }, [theme]);

  // Listen for system theme changes if using 'system' theme
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Function to set the theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === 'light') {
      setThemeState('dark');
    } else if (theme === 'dark') {
      setThemeState('system');
    } else {
      setThemeState('light');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 