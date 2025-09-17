import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaBook, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';

const MobileNavigation = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  // Check if the current path matches a nav item
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-10">
      <div className="grid grid-cols-4 h-14">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/') 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FaHome className="h-5 w-5 mb-1" />
          <span>{t('header.home')}</span>
        </Link>
        
        <Link
          to="/browse"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/browse') 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FaCompass className="h-5 w-5 mb-1" />
          <span>{t('header.browse')}</span>
        </Link>
        
        <Link
          to={currentUser ? "/library" : "/login"}
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/library') 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FaBook className="h-5 w-5 mb-1" />
          <span>{t('header.library')}</span>
        </Link>
        
        <Link
          to={currentUser ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/profile') || isActive('/login')
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FaUser className="h-5 w-5 mb-1" />
          <span>{currentUser ? t('header.profile') : t('header.login')}</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;