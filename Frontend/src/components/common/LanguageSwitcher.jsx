import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'pl' ? 'en' : 'pl';
    changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
      aria-label="Zmień język"
    >
      <FaGlobe className="w-5 h-5" />
      <span className="ml-2 text-sm font-medium">{language === 'pl' ? 'EN' : 'PL'}</span>
    </button>
  );
};

export default LanguageSwitcher;