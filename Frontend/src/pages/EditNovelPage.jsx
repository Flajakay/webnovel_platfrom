import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaTags, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import ImageUploader from '../components/common/ImageUploader';
import MobileNavigation from '../components/layout/MobileNavigation';
import NovelService from '../services/novel.service';
import { useAuth } from '../hooks/useAuth';
import { GENRES, NOVEL_STATUS } from '../utils/constants';

const EditNovelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [],
    tags: [],
    status: NOVEL_STATUS.ONGOING
  });
  
  const [originalCoverUrl, setOriginalCoverUrl] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState('');
  
  // Fetch novel data
  useEffect(() => {
    const fetchNovel = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await NovelService.getNovelById(id);
        if (response.status === 'success') {
          const novelData = response.data;
          setFormData({
            title: novelData.title || '',
            description: novelData.description || '',
            genres: novelData.genres || [],
            tags: novelData.tags || [],
            status: novelData.status || NOVEL_STATUS.ONGOING
          });
          
          // Set cover preview if available
          if (novelData.hasCover) {
            setOriginalCoverUrl(NovelService.getNovelCoverUrl(id));
          }
        } else {
          setError('Nie udało się załadować danych powieści');
        }
      } catch (err) {
        setError('Nie udało się załadować danych powieści. Spróbuj ponownie później.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNovel();
  }, [id]);
  
  // Check if user is authorized to edit this novel
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        if (!currentUser) {
          navigate('/login', { state: { from: `/novels/${id}/edit` } });
          return;
        }
        
        // Get user's novels to check ownership
        const userNovels = await NovelService.getMyNovels();
        if (userNovels.status === 'success') {
          const novels = userNovels.data.data || userNovels.data;
          const isAuthor = novels.some(novel => {
            const novelId = novel.id || novel._id;
            return novelId === id;
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
  }, [id, currentUser, navigate]);
  
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
        alert('Możesz wybrać maksymalnie 5 gatunków');
      }
    }
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    
    if (!newTag.trim()) return;
    
    if (formData.tags.includes(newTag.trim())) {
      alert('Ten tag już istnieje');
      return;
    }
    
    if (formData.tags.length >= 10) {
      alert('Możesz dodać maksymalnie 10 tagów');
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
      setError('Wybierz przynajmniej jeden gatunek');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await NovelService.updateNovel(id, formData, coverFile);
      
      if (response.status === 'success') {
        // Navigate back to the novel page
        navigate(`/novels/${id}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Nie udało się zaktualizować powieści. Spróbuj ponownie.';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edytuj Powieść</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tytuł <span className="text-red-500">*</span>
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
                  placeholder="Wprowadź porywający tytuł"
                  required
                  maxLength={100}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maksymalnie 100 znaków
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opis <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Napisz fascynujący opis swojej powieści"
                required
                rows={5}
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.description.length}/1000 znaków
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gatunki <span className="text-red-500">*</span> <span className="text-gray-500 dark:text-gray-400 text-xs">(Wybierz maksymalnie 5)</span>
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
                  Wybierz przynajmniej jeden gatunek
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tagi <span className="text-gray-500 dark:text-gray-400 text-xs">(Opcjonalne, maksymalnie 10)</span>
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
                    placeholder="Dodaj tag"
                    maxLength={20}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  disabled={!newTag.trim() || formData.tags.length >= 10}
                >
                  Dodaj
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tagi pomagają czytelnikom znaleźć twoją powieść (maksymalnie 20 znaków na tag)
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={NOVEL_STATUS.ONGOING}
                    checked={formData.status === NOVEL_STATUS.ONGOING}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">W trakcie</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={NOVEL_STATUS.COMPLETED}
                    checked={formData.status === NOVEL_STATUS.COMPLETED}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Zakończona</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <ImageUploader
                label="Okładka"
                onChange={handleCoverChange}
                onRemove={handleRemoveCover}
                defaultImage={originalCoverUrl}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Dobra okładka może przyciągnąć więcej czytelników. Zalecany rozmiar: 600x900 pikseli.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                disabled={saving || formData.genres.length === 0}
              >
                {saving ? 'Zapisywanie...' : 'Zapisz Zmiany'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default EditNovelPage;