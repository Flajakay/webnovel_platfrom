import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTwitter, FaGithub } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400">Opowiadamy</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:gap-6 md:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.resources')}</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-2">
                  <Link to="/browse" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('header.browse')}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/browse" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.genres')}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/browse" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.trending')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.authors')}</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-2">
                  <Link to="/novels/create" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.startWriting')}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/guidelines" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.guidelines')}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.faq')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.legal')}</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-2">
                  <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.privacyPolicy')}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t('footer.termsConditions')}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            © {currentYear} Opowiadamy. {t('footer.allRightsReserved')} <FaHeart className="inline-block text-red-500 mx-1" /> {t('footer.by')}
          </p>
          <div className="flex space-x-6">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <FaTwitter className="w-5 h-5" />
              <span className="sr-only">Twitter page</span>
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <FaGithub className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;