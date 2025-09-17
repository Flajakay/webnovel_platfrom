import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import AuthService from '../services/auth.service';
import { useLanguage } from '../context/LanguageContext';

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError(t('forgotPasswordPage.emailRequired'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('forgotPasswordPage.emailInvalid'));
      return;
    }

    setLoading(true);

    try {
      await AuthService.forgotPassword(email);
      setEmailSent(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('forgotPasswordPage.requestFailed');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError('');
    setLoading(true);

    try {
      await AuthService.forgotPassword(email);
      // Show success message briefly
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('forgotPasswordPage.requestFailed');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('forgotPasswordPage.emailSent')}
              </h1>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('forgotPasswordPage.checkEmailTitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('forgotPasswordPage.checkEmailDescription')}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('forgotPasswordPage.didntReceive')}
              </p>
              
              <Button
                onClick={handleResendEmail}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? t('forgotPasswordPage.sending') : t('forgotPasswordPage.resendLink')}
              </Button>

              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                {t('forgotPasswordPage.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {t('forgotPasswordPage.title')}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {t('forgotPasswordPage.description')}
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('forgotPasswordPage.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('common.emailPlaceholder')}
                  required
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2 mb-4"
              disabled={loading}
            >
              {loading ? t('forgotPasswordPage.sending') : t('forgotPasswordPage.sendResetLink')}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              <FaArrowLeft className="mr-2" />
              {t('forgotPasswordPage.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;