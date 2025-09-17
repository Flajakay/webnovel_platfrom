import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaBookmark, FaBookReader, FaCheckCircle, FaPauseCircle, FaTimesCircle } from 'react-icons/fa';
import LibraryService from '../services/library.service';
import Layout from '../components/layout/Layout';
import LibraryItem from '../components/library/LibraryItem';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import MobileNavigation from '../components/layout/MobileNavigation';

const LibraryPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('all');
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tabs for library status
  const tabs = [
    { id: 'all', label: t('library.all'), icon: <FaBook /> },
    { id: 'WILL_READ', label: t('library.willRead'), icon: <FaBookmark /> },
    { id: 'READING', label: t('library.reading'), icon: <FaBookReader /> },
    { id: 'COMPLETED', label: t('library.completed'), icon: <FaCheckCircle /> },
    { id: 'ON_HOLD', label: t('library.onHold'), icon: <FaPauseCircle /> },
    { id: 'DROPPED', label: t('library.dropped'), icon: <FaTimesCircle /> }
  ];
  
  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/library' } });
    }
  }, [currentUser, navigate]);
  
  // Fetch library data
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const status = activeTab !== 'all' ? activeTab : null;
        const response = await LibraryService.getUserLibrary(status);
        
        if (response.data.status === 'success') {
          // The library items might be in data.data or directly in data
          const libraryData = response.data.data.data || response.data.data;
          setLibrary(Array.isArray(libraryData) ? libraryData : []);
        } else {
          setLibrary([]);
        }
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLibrary();
  }, [activeTab, currentUser]);
  
  // Handle status change
  const handleStatusChange = async (novelId, status) => {
    try {
      await LibraryService.updateStatus(novelId, status);
      
      // Update local state safely
      setLibrary(prevLibrary => {
        return prevLibrary.map(item => {
          // Make sure the item and item.novel exist before trying to access _id
          if (item && item.novel && (item.novel._id === novelId || item.novel.id === novelId)) {
            return { ...item, status };
          }
          return item;
        });
      });
      
      // If we're on a filtered tab, remove the item if it no longer matches
      if (activeTab !== 'all' && activeTab !== status) {
        setLibrary(prevLibrary => {
          return prevLibrary.filter(item => {
            if (!item || !item.novel) return false;
            const itemId = item.novel._id || item.novel.id;
            return itemId !== novelId;
          });
        });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };
  
  // Handle remove from library
  const handleRemove = async (novelId) => {
    try {
      await LibraryService.removeFromLibrary(novelId);
      
      // Remove from local state with safe checks
      setLibrary(prevLibrary => 
        prevLibrary.filter(item => {
          if (!item || !item.novel) return false;
          const itemId = item.novel._id || item.novel.id;
          return itemId !== novelId;
        })
      );
    } catch (err) {
      console.error('Failed to remove from library:', err);
    }
  };
  
  // Get filtered library based on active tab
  const filteredLibrary = activeTab === 'all' 
    ? library 
    : library.filter(item => item.status === activeTab);
    
  // Map library items for rendering, safely handling nulls
  const safeLibraryItems = filteredLibrary.filter(item => item && item.novel);
  
  return (
    <Layout>
      <div className="pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('library.title')}</h1>
          
          {/* Status Tabs */}
          <div className="mb-6 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="ml-2 bg-white/20 rounded-full text-xs px-2">
                      {filteredLibrary.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Library Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('library.loadingLibrary')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                {t('common.tryAgain')}
              </Button>
            </div>
          ) : safeLibraryItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {activeTab === 'all'
                  ? t('library.emptyLibrary')
                  : t('library.emptyCategory').replace("{category}", tabs.find(tab => tab.id === activeTab)?.label)}
              </p>
              <Button as="link" to="/browse">
                {t('library.browseNovels')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 relative z-0">
              {safeLibraryItems.map(item => (
                <LibraryItem 
                  key={item.novel._id || item.novel.id}
                  item={item}
                  onStatusChange={handleStatusChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default LibraryPage;