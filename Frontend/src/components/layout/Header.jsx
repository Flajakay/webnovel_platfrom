import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaBook, FaBars, FaTimes, FaMoon, FaSun, FaHome, FaCompass, FaBookmark, FaChartBar, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../common/Button';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { settings, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePath, setActivePath] = useState('/');

  // Update active path when location changes
  useEffect(() => {
    const path = location.pathname;
    setActivePath(path);
  }, [location]);
  
  // Helper function to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center mr-2">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                <FaBook className="mr-1.5" />
                Opowiadamy
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className={`${isActive('/') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-600 dark:text-gray-300'} hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium flex items-center`}>
                <FaHome className="mr-1.5 text-indigo-500" />
                {t('header.home')}
              </Link>
              <Link to="/browse" className={`${isActive('/browse') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-600 dark:text-gray-300'} hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium flex items-center`}>
                <FaCompass className="mr-1.5 text-indigo-500" />
                {t('header.browse')}
              </Link>
              {currentUser && (
                <>
                  <Link to="/library" className={`${isActive('/library') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-600 dark:text-gray-300'} hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium flex items-center`}>
                    <FaBookmark className="mr-1.5 text-indigo-500" />
                    {t('header.library')}
                  </Link>
                  <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-600 dark:text-gray-300'} hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium flex items-center`}>
                    <FaChartBar className="mr-1.5 text-indigo-500" />
                    {t('header.dashboard')}
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Desktop Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 px-3 py-1.5 rounded-md text-sm bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaSearch className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </form>
           
            
            {/* User Menu - Desktop */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {currentUser ? (
                <div className="group relative">
                  <div className="flex items-center text-sm cursor-pointer py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{currentUser.username}</span>
                    <FaChevronDown className="ml-1 text-gray-500 dark:text-gray-400 h-3 w-3" />
                  </div>
                  <div className="absolute right-0 z-50 mt-0 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 ease-in-out group-hover:translate-y-0 translate-y-1">
                    {/* Added 8px padding at top to create space for hover */}
                    <div className="pt-2">  
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.profile')}</Link>
                      <Link to={`/authors/${currentUser.id || currentUser._id}`} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.myNovels')}</Link>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.dashboard')}</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {t('header.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button as="link" to="/login" variant="outline" size="sm">{t('header.login')}</Button>
                  <Button as="link" to="/register" size="sm">{t('header.register')}</Button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {menuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 pb-3 px-4">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className={`block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center ${isActive('/') ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
              <FaHome className="mr-2 text-indigo-500" />
              {t('header.home')}
            </Link>
            <Link to="/browse" className={`block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center ${isActive('/browse') ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
              <FaCompass className="mr-2 text-indigo-500" />
              {t('header.browse')}
            </Link>
            {currentUser && (
              <>
                <Link to="/library" className={`block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center ${isActive('/library') ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  <FaBookmark className="mr-2 text-indigo-500" />
                  {t('header.library')}
                </Link>
                <Link to="/dashboard" className={`block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center ${isActive('/dashboard') ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  <FaChartBar className="mr-2 text-indigo-500" />
                  {t('header.dashboard')}
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="pt-2 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaSearch className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </form>
          
          {/* Mobile User Menu */}
          {currentUser ? (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{currentUser.username}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentUser.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link to="/profile" className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{t('header.profile')}</Link>
                <Link to={`/authors/${currentUser.id || currentUser._id}`} className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{t('header.myNovels')}</Link>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{t('header.dashboard')}</Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  {t('header.logout')}
                </button>
              </div>

            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2">
                <Button as="link" to="/login" className="w-full">{t('header.login')}</Button>
                <Button as="link" to="/register" className="w-full" variant="outline">{t('header.register')}</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;