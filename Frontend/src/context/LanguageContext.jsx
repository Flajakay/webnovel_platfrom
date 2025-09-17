import React, { createContext, useState, useContext } from 'react';
import translations from '../utils/translations';

// Tworzenie kontekstu dla tłumaczeń
const LanguageContext = createContext();

// Hook do korzystania z kontekstu tłumaczeń
export const useLanguage = () => useContext(LanguageContext);

// Provider dla kontekstu tłumaczeń
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pl'); // Domyślny język: polski
  
  // Funkcja zmieniająca język
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  // Funkcja pobierająca tłumaczenie
  const t = (key, params = {}) => {
    // Rozdzielanie klucza na części (np. 'header.home' -> ['header', 'home'])
    const keys = key.split('.');
    
    // Przeszukiwanie zagnieżdżonego obiektu tłumaczeń
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Jeśli nie znaleziono tłumaczenia, zwróć klucz
        return key;
      }
    }
    
    // Replace placeholders with provided parameters
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
        return params[placeholder] !== undefined ? params[placeholder] : match;
      });
    }
    
    return value;
  };
  
  const value = {
    language,
    changeLanguage,
    t
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;