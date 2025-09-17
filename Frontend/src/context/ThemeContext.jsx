import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get saved settings from localStorage or use defaults
  const getSavedSettings = () => {
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Always ensure theme is set to dark, regardless of what was saved
        return {
          ...parsed,
          theme: 'dark' // Force dark theme as default
        };
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    return {
      theme: 'dark', // Default to dark theme
      fontSize: 16,
      lineHeight: 1.6,
      fontFamily: 'sans',
    };
  };

  // Initialize settings state with forced dark theme
  const [settings, setSettings] = useState(getSavedSettings);

  // Apply the theme when component mounts or settings change
  useEffect(() => {
    // Always apply dark theme (no light theme support)
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#111827'; // bg-gray-900
    document.body.style.color = '#ffffff'; // text-white
    
    // Save to localStorage with forced dark theme
    const settingsToSave = { ...settings, theme: 'dark' };
    localStorage.setItem('readerSettings', JSON.stringify(settingsToSave));
  }, [settings]);

  // Apply initial dark theme when component mounts (force dark theme by default)
  useEffect(() => {
    // Always set dark theme by default, ignoring any system preferences
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#111827'; // bg-gray-900
    document.body.style.color = '#ffffff'; // text-white
  }, []);

  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleTheme = () => {
    // Always keep theme as dark - prevent switching to light mode
    updateSetting('theme', 'dark');
  };

  // Get CSS variables for reader based on settings
  const getReaderStyle = () => {
    return {
      fontSize: `${settings.fontSize}px`,
      lineHeight: settings.lineHeight,
      fontFamily: getFontFamily(settings.fontFamily),
    };
  };

  // Helper to map font family settings to actual CSS
  const getFontFamily = (fontKey) => {
    const fonts = {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    };
    return fonts[fontKey] || fonts.sans;
  };

  const value = {
    settings,
    updateSetting,
    toggleTheme,
    getReaderStyle,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
