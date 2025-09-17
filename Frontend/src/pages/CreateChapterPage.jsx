import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeading } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import RichTextEditor from '../components/common/RichTextEditor';
import MobileNavigation from '../components/layout/MobileNavigation';
import NovelService from '../services/novel.service';
import ChapterService from '../services/chapter.service';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { CHAPTER_STATUS } from '../utils/constants';

const CreateChapterPage = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [novel, setNovel] = useState(null);
  const [formData, setFormData] = useState({
    chapterNumber: 1,
    title: '',
    content: '',
    status: CHAPTER_STATUS.DRAFT
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch novel data and determine next chapter number
  useEffect(() => {
    const fetchData = async () => {
      if (!novelId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get novel details
        const novelResponse = await NovelService.getNovelById(novelId);
        if (novelResponse.status === 'success') {
          setNovel(novelResponse.data);
          
          // Get existing chapters to determine next chapter number
          const chaptersResponse = await ChapterService.getChapters(novelId);
          if (chaptersResponse.status === 'success') {
            const chapters = chaptersResponse.data.chapters || [];
            
            // Find the highest chapter number and add 1
            let nextChapterNumber = 1;
            if (chapters.length > 0) {
              const highestChapterNumber = Math.max(...chapters.map(c => c.chapterNumber));
              nextChapterNumber = highestChapterNumber + 1;
            }
            
            setFormData(prev => ({
              ...prev,
              chapterNumber: nextChapterNumber,
              title: `Chapter ${nextChapterNumber}`
            }));
          }
        } else {
          setError('Failed to load novel data');
        }
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [novelId]);
  
  // Check if user is authorized to add chapters to this novel
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        if (!currentUser) {
          navigate('/login', { state: { from: `/novels/${novelId}/chapters/create` } });
          return;
        }
        
        // Get user's novels to check ownership
        const userNovels = await NovelService.getMyNovels();
        if (userNovels.status === 'success') {
          const novels = userNovels.data.data || userNovels.data;
          const isAuthor = novels.some(novel => {
            const id = novel.id || novel._id;
            return id === novelId;
          });
          
          if (!isAuthor) {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Authorization check failed:', err);
        navigate('/dashboard');
      }
    };
    
    checkAuthorization();
  }, [novelId, currentUser, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate content length
    if (formData.content.length < 100) {
      setError(t('createChapterPage.contentLengthError'));
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await ChapterService.createChapter(novelId, formData);
      
      if (response.status === 'success') {
        // Navigate to the chapter page or novel details page
        navigate(`/novels/${novelId}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('createChapterPage.saveFailed');
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-2">{t('createChapterPage.loadingNovel')}</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('createChapterPage.title')}</h1>
            {novel && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('createChapterPage.novel')}: {novel.title}
              </p>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="md:col-span-1">
                <label htmlFor="chapterNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('createChapterPage.chapterNumber')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="chapterNumber"
                  name="chapterNumber"
                  type="number"
                  min="1"
                  value={formData.chapterNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div className="md:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('createChapterPage.chapterTitle')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHeading className="text-gray-400" />
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder={t('createChapterPage.titlePlaceholder')}
                    required
                    maxLength={200}
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('createChapterPage.chapterContent')} <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder={t('createChapterPage.contentPlaceholder')}
                height="500px"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('createChapterPage.minimumChars')}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('createChapterPage.status')} <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={CHAPTER_STATUS.DRAFT}
                    checked={formData.status === CHAPTER_STATUS.DRAFT}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('createChapterPage.draft')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={CHAPTER_STATUS.PUBLISHED}
                    checked={formData.status === CHAPTER_STATUS.PUBLISHED}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('createChapterPage.published')}</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('createChapterPage.draftInfo')}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                {t('createChapterPage.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? t('createChapterPage.saving') : t('createChapterPage.saveChapter')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default CreateChapterPage;