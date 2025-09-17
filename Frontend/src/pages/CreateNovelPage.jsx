import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaTags, FaList, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import TextArea from '../components/common/TextArea';
import Button from '../components/common/Button';
import ImageUploader from '../components/common/ImageUploader';
import MobileNavigation from '../components/layout/MobileNavigation';
import NovelService from '../services/novel.service';
import { useAuth } from '../hooks/useAuth';
import { GENRES } from '../utils/constants';

const CreateNovelPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [],
    tags: [],
    status: 'ongoing'
  });
  
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState('');
  
  // Check if user is logged in
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/novels/create' } });
    }
  }, [currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleGenreToggle = (genre) => {
    if (formData.genres.includes(genre)) {
      setFormData({
        ...formData,
        genres: formData.genres.filter(g => g !== genre)
      });
    } else {
      if (formData.genres.length < 5) {
        setFormData({
          ...formData,
          genres: [...formData.genres, genre]
        });
      } else {
        alert(t('createNovelPage.maxGenresError', { max: 5 }));
      }
    }
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    
    if (!newTag.trim()) return;
    
    if (formData.tags.includes(newTag.trim())) {
      alert(t('createNovelPage.tagExists'));
      return;
    }
    
    if (formData.tags.length >= 10) {
      alert(t('createNovelPage.maxTagsError', { max: 10 }));
      return;
    }
    
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag.trim()]
    });
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };
  
  const handleCoverChange = (file) => {
    setCoverFile(file);
  };
  
  const handleRemoveCover = () => {
    setCoverFile(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.genres.length === 0) {
      setError(t('createNovelPage.selectGenreError'));
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await NovelService.createNovel(formData, coverFile);
      
      if (response.status === 'success') {
        // Navigate to the novel page
        const novelId = response.data.id || response.data._id;
        navigate(`/novels/${novelId}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('createNovelPage.createFailed');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentUser) {
    return null; // will redirect via useEffect
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('createNovelPage.title')}</h1>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBook className="text-gray-400" />
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('createNovelPage.captivatingTitle')}
                  required
                  maxLength={100}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('createNovelPage.maxChars', { max: 100 })}
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('createNovelPage.description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder={t('createNovelPage.writeDescription')}
                required
                rows={5}
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('createNovelPage.charsCount', { current: formData.description.length, max: 1000 })}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('createNovelPage.genres')} <span className="text-red-500">*</span> <span className="text-gray-500 dark:text-gray-400 text-xs">{t('createNovelPage.selectUpTo', { max: 5 })}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      formData.genres.includes(genre)
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {formData.genres.length === 0 && (
                <p className="mt-1 text-xs text-red-500">
                  {t('createNovelPage.selectAtLeastOne')}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('createNovelPage.tags')} <span className="text-gray-500 dark:text-gray-400 text-xs">{t('createNovelPage.optional', { max: 10 })}</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <div
                    key={tag}
                    className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTags className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder={t('createNovelPage.addTag')}
                    maxLength={20}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  disabled={!newTag.trim() || formData.tags.length >= 10}
                >
                  {t('common.add')}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('createNovelPage.tagsHelp', { max: 20 })}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('createNovelPage.status')} <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="ongoing"
                    checked={formData.status === 'ongoing'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('createNovelPage.ongoing')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="completed"
                    checked={formData.status === 'completed'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('createNovelPage.completed')}</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <ImageUploader
                label={t('createNovelPage.coverImage')}
                onChange={handleCoverChange}
                onRemove={handleRemoveCover}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('createNovelPage.coverHelp')}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                {t('createNovelPage.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={loading || formData.genres.length === 0}
              >
                {loading ? t('createNovelPage.creating') : t('createNovelPage.create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default CreateNovelPage;