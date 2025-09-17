import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaBook, FaStar, FaEye, FaChartBar, FaEdit, FaTrash, FaList } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import MobileNavigation from '../components/layout/MobileNavigation';
import NovelService from '../services/novel.service';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/helpers';

const AuthorDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [novels, setNovels] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [currentUser, navigate]);
  
  // Fetch user's novels and analytics
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user's novels
        const novelsResponse = await NovelService.getMyNovels();
        if (novelsResponse.status === 'success') {
          const novelsData = novelsResponse.data.data || novelsResponse.data;
          setNovels(Array.isArray(novelsData) ? novelsData : []);
        }
		
		const userId = currentUser._id || currentUser.id;
		
        // Fetch author analytics if available
        if (userId) {
          try {
            const analyticsResponse = await NovelService.getAuthorAnalytics(userId);
            if (analyticsResponse.status === 'success') {
              setAnalytics(analyticsResponse.data);
			  
            }
          } catch (err) {
            console.error('Failed to fetch analytics:', err);
          }
        }
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthorData();
  }, [currentUser]);
  
  // Handle novel deletion
  const handleDeleteNovel = async (novelId) => {
    if (!confirm(t('authorDashboard.confirmDelete'))) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await NovelService.deleteNovel(novelId);
      
      if (response.status === 'success') {
        // Update novels list
        setNovels(novels.filter(novel => {
          // Handle both id and _id
          const id = novel.id || novel._id;
          return id !== novelId;
        }));
      } else {
        alert(t('authorDashboard.deleteFailed'));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('authorDashboard.deleteFailed');
      alert(errorMsg);
      console.error('Failed to delete novel:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format analytics data
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };
  
  if (!currentUser) {
    return null; // will redirect via useEffect
  }
  console.log(analytics);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('authorDashboard.title')}</h1>
          <Button 
            as="link" 
            to="/novels/create" 
            className="mt-2 sm:mt-0"
          >
            <FaPlus className="mr-2" /> {t('authorDashboard.createNewNovel')}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Analytics Overview */}
		
        {analytics && analytics.aggregateStats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('authorDashboard.authorStats')}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">{t('authorDashboard.totalNovels')}</h3>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                  {formatNumber(analytics.aggregateStats.totalNovels)}
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">{t('authorDashboard.totalViews')}</h3>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                  {formatNumber(analytics.aggregateStats.totalViews)}
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">{t('authorDashboard.avgRating')}</h3>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
                  {analytics.aggregateStats.avgRating?.toFixed(1) || '0.0'} <span className="text-sm font-normal">({formatNumber(analytics.aggregateStats.totalRatings)} {t('authorDashboard.ratings')})</span>
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">{t('authorDashboard.totalChapters')}</h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  {formatNumber(analytics.aggregateStats.totalChapters)}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">{t('authorDashboard.totalWords')}</h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  {formatNumber(analytics.aggregateStats.totalWords)}
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">{t('authorDashboard.chapterReads')}</h3>
                <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                  {formatNumber(analytics.aggregateStats.totalChapterReads)}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Novels List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('authorDashboard.yourNovels')}</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('authorDashboard.loadingNovels')}</p>
            </div>
          ) : novels.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('authorDashboard.noNovels')}
              </p>
              <Button 
                as="link" 
                to="/novels/create"
              >
                <FaPlus className="mr-2" /> {t('authorDashboard.createFirstNovel')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('authorDashboard.novel')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('authorDashboard.stats')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('authorDashboard.status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('authorDashboard.lastUpdated')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('authorDashboard.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {novels.map(novel => {
                    // Get novel ID (handle both id and _id)
                    const novelId = novel.id || novel._id;
                    
                    return (
                      <tr key={novelId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                              <FaBook />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                <Link to={`/novels/${novelId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                  {novel.title}
                                </Link>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {novel.genres?.slice(0, 2).join(', ')}
                                {novel.genres?.length > 2 && ` +${novel.genres.length - 2} more`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span>{novel.calculatedStats?.averageRating?.toFixed(1) || '0.0'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <FaEye className="text-gray-400 mr-1" />
                              <span>{novel.viewCount || 0}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <FaBook className="text-gray-400 mr-1" />
                              <span>{novel.totalChapters || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            novel.status === 'ongoing' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : novel.status === 'completed'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {novel.status === 'ongoing' ? t('authorDashboard.ongoing') : 
                              novel.status === 'completed' ? t('authorDashboard.completed') : 
                              t('authorDashboard.hiatus')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(novel.updatedAt || novel.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                          <Button 
                          as="link" 
                          to={`/novels/${novelId}/edit`}
                          variant="outline"
                          size="sm"
                          title={t('authorDashboard.editNovel')}
                          >
                          <FaEdit />
                          </Button>
                          <Button 
                          as="link" 
                          to={`/novels/${novelId}/manage-chapters`}
                          variant="outline"
                          size="sm"
                          title={t('authorDashboard.manageChapters')}
                          >
                          <FaList />
                          </Button>
                          <Button 
                          as="link" 
                          to={`/novels/${novelId}/chapters/create`}
                          variant="outline"
                          size="sm"
                          title={t('authorDashboard.addChapter')}
                          >
                          <FaPlus />
                          </Button>
                            <Button 
                                onClick={() => handleDeleteNovel(novelId)}
                                variant="danger"
                                size="sm"
                                title={t('authorDashboard.deleteNovel')}
                                disabled={loading}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default AuthorDashboardPage;