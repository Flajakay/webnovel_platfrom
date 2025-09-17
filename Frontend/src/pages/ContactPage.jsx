import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import MobileNavigation from '../components/layout/MobileNavigation';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('contactPage.title')}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('contactPage.contactInfo')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('contactPage.email')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@opowiadamy.pl</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                    <FaPhone className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('contactPage.phone')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">+48 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('contactPage.address')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Nicolaus Copernicus University<br />
                      Gagarina 11<br />
                      87-100 Toruń<br />
                      Poland
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('contactPage.followUs')}</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 dark:hover:bg-indigo-600 text-gray-700 dark:text-gray-300 hover:text-white p-2 rounded-full transition-colors"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.532l-.047-.02z" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 dark:hover:bg-indigo-600 text-gray-700 dark:text-gray-300 hover:text-white p-2 rounded-full transition-colors"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('contactPage.sendMessage')}</h2>
              
              {success ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="text-green-800 dark:text-green-400 font-medium">{t('contactPage.messageSent')}</h3>
                  <p className="text-green-700 dark:text-green-300 mt-1">
                    {t('contactPage.thankYou')}
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    className="mt-4"
                  >
                    {t('contactPage.sendAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contactPage.yourName')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                          placeholder={t('contactPage.placeholders.name')}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contactPage.emailAddress')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                          placeholder={t('contactPage.placeholders.email')}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('contactPage.subject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      placeholder={t('contactPage.placeholders.subject')}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('contactPage.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                      placeholder={t('contactPage.placeholders.message')}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-red-500">*</span> {t('contactPage.requiredFields')}
                    </p>
                    <Button
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? t('contactPage.sending') : t('contactPage.send')}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default ContactPage;