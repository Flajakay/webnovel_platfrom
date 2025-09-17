import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBirthdayCake, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import MobileNavigation from '../components/layout/MobileNavigation';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/auth.service';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load current user data
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }

    // Format date properly for input field
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    };

    console.log('Current user data:', currentUser); // Debug log
    console.log('Date of birth from API:', currentUser.dateOfBirth); // Debug log
    
    const formattedDate = formatDateForInput(currentUser.dateOfBirth);
    console.log('Formatted date:', formattedDate); // Debug log

    setFormData({
      username: currentUser.username || '',
      email: currentUser.email || '',
      dateOfBirth: formattedDate,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate form
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Nowe hasła nie są zgodne');
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setError('Obecne hasło jest wymagane przy zmianie hasła');
      return;
    }

    try {
      setLoading(true);

      const updateData = {};

      // Only include fields that have changed
      if (formData.username && formData.username !== currentUser.username) {
        updateData.username = formData.username;
      }

      if (formData.email && formData.email !== currentUser.email) {
        updateData.email = formData.email;
      }

      if (formData.dateOfBirth) {
        // Compare dates properly
        const currentDate = currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '';
        if (formData.dateOfBirth !== currentDate) {
          updateData.dateOfBirth = formData.dateOfBirth;
        }
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      if (Object.keys(updateData).length > 0) {
        const response = await updateProfile(updateData);

        if (response.status === 'success') {
          setMessage('Profil zaktualizowano pomyślnie');

          // Clear password fields
          setFormData(prevData => ({
            ...prevData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
      } else {
        setMessage('Nie wprowadzono żadnych zmian');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.errors?.[0]?.msg || 
                      'Nie udało się zaktualizować profilu';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    return null; // will redirect via useEffect
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Twój Profil</h1> {/* Przetłumaczone */}

        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-md mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nazwa użytkownika {/* Przetłumaczone */}
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email {/* Przetłumaczone, alternatywnie: Adres e-mail */}
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data urodzenia {/* Przetłumaczone */}
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBirthdayCake className="text-gray-400" />
                </div>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Zmień hasło</h3> {/* Przetłumaczone */}

              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Obecne hasło {/* Przetłumaczone */}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => toggleShowPassword('current')}
                    tabIndex="-1"
                  >
                    {showPasswords.current ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nowe hasło {/* Przetłumaczone */}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => toggleShowPassword('new')}
                    tabIndex="-1"
                  >
                    {showPasswords.new ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formData.newPassword && formData.newPassword.length < 8 && (
                  <p className="mt-1 text-xs text-red-500">Hasło musi mieć co najmniej 8 znaków</p> // Przetłumaczone
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Potwierdź nowe hasło {/* Przetłumaczone */}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => toggleShowPassword('confirm')}
                    tabIndex="-1"
                  >
                    {showPasswords.confirm ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formData.newPassword && formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Hasła nie są zgodne</p> // Przetłumaczone
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
              >
                Wyloguj się {/* Przetłumaczone */}
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Zapisywanie...' : 'Zapisz zmiany'} {/* Przetłumaczone */}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <MobileNavigation />
    </Layout>
  );
};

export default ProfilePage;