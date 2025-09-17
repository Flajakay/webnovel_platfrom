import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { currentUser, register, error: authError, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = t('registerPage.validation.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('registerPage.validation.usernameLength');
    } else if (formData.username.length > 20) {
      newErrors.username = t('registerPage.validation.usernameMaxLength');
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = t('registerPage.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('registerPage.validation.emailInvalid');
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = t('registerPage.validation.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('registerPage.validation.passwordLength');
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('registerPage.validation.passwordsDoNotMatch');
    }
    
    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('registerPage.validation.dobRequired');
    } else {
      // Check if user is at least 13 years old
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.dateOfBirth = t('registerPage.validation.dobAge');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (validateForm()) {
      try {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth
        });
        
        navigate('/login', { 
          state: { 
            message: t('registerPage.registerSuccess') 
          } 
        });
      } catch (err) {
        setFormError(authError || t('registerPage.registerFailed'));
      }
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">{t('registerPage.title')}</h1>
          
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-4 py-3 rounded-md mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('registerPage.username')} <span className="text-red-500">{t('registerPage.required')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white`}
                  placeholder={t('registerPage.username')}
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('registerPage.publicDisplayName')}
              </p>
            </div>
            
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('registerPage.email')} <span className="text-red-500">{t('registerPage.required')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white`}
                  placeholder={t('common.emailPlaceholder')}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('registerPage.password')} <span className="text-red-500">{t('registerPage.required')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('registerPage.atLeast8Chars')}
              </p>
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('registerPage.confirmPassword')} <span className="text-red-500">{t('registerPage.required')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Date of Birth Field */}
            <div className="mb-6">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('registerPage.dateOfBirth')} <span className="text-red-500">{t('registerPage.required')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white`}
                  required
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('registerPage.atLeast13Years')}
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full py-2"
              disabled={authLoading}
            >
              {authLoading ? t('registerPage.creatingAccount') : t('registerPage.createAccount')}
            </Button>
          </form>
          
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('registerPage.haveAccount')}{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                {t('registerPage.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;