import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import AuthService from '../services/auth.service';
import { useLanguage } from '../context/LanguageContext';

const ResetPasswordPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError(t('resetPasswordPage.invalidToken'));
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, t]);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]*$/;
    return password.length >= 8 && passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (!newPassword) {
      setError(t('resetPasswordPage.passwordRequired'));
      return;
    }

    if (newPassword.length < 8) {
      setError(t('resetPasswordPage.passwordLength'));
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(t('resetPasswordPage.passwordPattern'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('resetPasswordPage.passwordsDoNotMatch'));
      return;
    }

    if (!token) {
      setError(t('resetPasswordPage.invalidToken'));
      return;
    }

    setLoading(true);

    try {
      await AuthService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      let errorMsg;
      
      if (err.response?.status === 401) {
        errorMsg = t('resetPasswordPage.tokenExpired');
      } else {
        errorMsg = err.response?.data?.message || t('resetPasswordPage.resetFailed');
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', { 
      state: { 
        message: t('resetPasswordPage.passwordResetSuccess')
      } 
    });
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('resetPasswordPage.passwordResetSuccess')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('resetPasswordPage.successDescription')}
              </p>
            </div>

            <Button
              onClick={handleGoToLogin}
              className="w-full py-2"
            >
              {t('resetPasswordPage.goToLogin')}
            </Button>
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
            {t('resetPasswordPage.title')}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {t('resetPasswordPage.description')}
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('resetPasswordPage.newPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('common.passwordPlaceholder')}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex="-1"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('resetPasswordPage.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('common.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2 mb-4"
              disabled={loading || !token}
            >
              {loading ? t('resetPasswordPage.resetting') : t('resetPasswordPage.resetPassword')}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              <FaArrowLeft className="mr-2" />
              {t('resetPasswordPage.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;