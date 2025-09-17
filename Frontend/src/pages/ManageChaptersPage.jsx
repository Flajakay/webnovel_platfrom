import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaSort, FaBookmark, FaFileImport, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import NovelService from '../services/novel.service';
import ChapterService from '../services/chapter.service';
import { useAuth } from '../hooks/useAuth';
import { CHAPTER_STATUS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import MobileNavigation from '../components/layout/MobileNavigation';
import { useLanguage } from '../context/LanguageContext';

const ManageChaptersPage = () => {
  const { id: novelId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('chapterNumber');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // EPUB Import States
  const [showImportModal, setShowImportModal] = useState(false);
  const [epubFile, setEpubFile] = useState(null);
  const [importOptions, setImportOptions] = useState({
    overwrite: false,
    draft: true
  });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  
  const fileInputRef = useRef(null);
  
  // Fetch novel and chapters data
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
          
          // Get chapters
          const chaptersResponse = await ChapterService.getChapters(novelId);
          if (chaptersResponse.status === 'success') {
            const chaptersData = chaptersResponse.data.chapters || chaptersResponse.data;
            setChapters(Array.isArray(chaptersData) ? chaptersData : []);
          } else {
            setError('Failed to load chapters');
          }
        } else {
          setError('Failed to load novel data');
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [novelId]);
  
  // Check if user is authorized to manage this novel
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        if (!currentUser) {
          navigate('/login', { state: { from: `/novels/${novelId}/manage-chapters` } });
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
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/epub+zip') {
      setEpubFile(selectedFile);
      setImportError(null);
    } else {
      setEpubFile(null);
      setImportError(t('manageChapters.invalidFile'));
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/epub+zip') {
      setEpubFile(droppedFile);
      setImportError(null);
    } else {
      setEpubFile(null);
      setImportError(t('manageChapters.invalidFile'));
    }
  };

  // Handle option changes
  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setImportOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Import EPUB
  const handleImport = async () => {
    if (!epubFile) {
      setImportError(t('manageChapters.invalidFile'));
      return;
    }

    try {
      setImporting(true);
      setImportError(null);
      setImportResult(null);

      const response = await NovelService.importChaptersFromEpub(
        novelId,
        epubFile,
        importOptions
      );

      if (response.status === 'success') {
        setImportResult(response.data);
        // Refresh chapter list
        const chaptersResponse = await ChapterService.getChapters(novelId);
        if (chaptersResponse.status === 'success') {
          const chaptersData = chaptersResponse.data.chapters || chaptersResponse.data;
          setChapters(Array.isArray(chaptersData) ? chaptersData : []);
        }
      } else {
        setImportError(t('manageChapters.importFailed'));
      }
    } catch (err) {
      console.error('EPUB import error:', err);
      setImportError(err.response?.data?.message || t('manageChapters.importFailed'));
    } finally {
      setImporting(false);
    }
  };

  // Reset import state
  const resetImport = () => {
    setEpubFile(null);
    setImportError(null);
    setImportResult(null);
    setImportOptions({
      overwrite: false,
      draft: true
    });
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    resetImport();
  };

  const openImportModal = () => {
    setShowImportModal(true);
    resetImport();
  };
  
  // Handle chapter deletion
  const handleDeleteChapter = async (chapterNumber) => {
    if (!confirm(`Are you sure you want to delete Chapter ${chapterNumber}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await ChapterService.deleteChapter(novelId, chapterNumber);
      
      if (response.status === 'success') {
        // Update chapters list
        setChapters(chapters.filter(chapter => chapter.chapterNumber !== chapterNumber));
      } else {
        alert('Failed to delete chapter. Please try again.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete chapter. Please try again.';
      alert(errorMsg);
      console.error('Failed to delete chapter:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle sort order or change sort field
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Sort chapters
  const sortedChapters = [...chapters].sort((a, b) => {
    let compareA, compareB;
    
    // Get the values to compare based on sortBy
    switch (sortBy) {
      case 'chapterNumber':
        compareA = a.chapterNumber;
        compareB = b.chapterNumber;
        break;
      case 'title':
        compareA = a.title || '';
        compareB = b.title || '';
        break;
      case 'status':
        compareA = a.status || '';
        compareB = b.status || '';
        break;
      case 'readCount':
        compareA = a.readCount || 0;
        compareB = b.readCount || 0;
        break;
      case 'wordCount':
        compareA = a.wordCount || 0;
        compareB = b.wordCount || 0;
        break;
      case 'updatedAt':
        compareA = new Date(a.updatedAt || a.createdAt).getTime();
        compareB = new Date(b.updatedAt || b.createdAt).getTime();
        break;
      default:
        compareA = a.chapterNumber;
        compareB = b.chapterNumber;
    }
    
    // Compare the values
    if (typeof compareA === 'string' && typeof compareB === 'string') {
      return sortOrder === 'asc' 
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    } else {
      return sortOrder === 'asc' 
        ? compareA - compareB
        : compareB - compareA;
    }
  });
  
  // Get sort icon and class
  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="ml-1 text-gray-400" />;
    return sortOrder === 'asc' 
      ? <FaSort className="ml-1 text-indigo-500" /> 
      : <FaSort className="ml-1 rotate-180 text-indigo-500" />;
  };
  
  if (loading && !chapters.length) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('manageChapters.title')}</h1>
            {novel && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('manageChapters.novel')}: {novel.title}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={openImportModal}
              title={t('manageChapters.importFromEpub')}
            >
              <FaFileImport className="mr-2" /> {t('manageChapters.importFromEpub')}
            </Button>
            <Button 
              as="link" 
              to={`/novels/${novelId}/chapters/create`}
            >
              <FaPlus className="mr-2" /> {t('manageChapters.addChapter')}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('chapterNumber')}
                  >
                    <div className="flex items-center">
                      {t('manageChapters.chapter')}
                      {getSortIcon('chapterNumber')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      {t('manageChapters.chapterTitle')}
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      {t('manageChapters.status')}
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('readCount')}
                  >
                    <div className="flex items-center">
                      {t('manageChapters.reads')}
                      {getSortIcon('readCount')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('wordCount')}
                  >
                    <div className="flex items-center">
                      {t('manageChapters.words')}
                      {getSortIcon('wordCount')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('updatedAt')}
                  >
                    <div className="flex items-center">
                      {t('manageChapters.updated')}
                      {getSortIcon('updatedAt')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('manageChapters.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedChapters.length > 0 ? (
                  sortedChapters.map((chapter) => (
                    <tr key={chapter.chapterNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {chapter.chapterNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/novels/${novelId}/chapters/${chapter.chapterNumber}`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                          {chapter.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          chapter.status === CHAPTER_STATUS.PUBLISHED 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {chapter.status === CHAPTER_STATUS.PUBLISHED ? 'Opublikowany' : 'Szkic'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FaEye className="mr-1 text-gray-400" />
                          <span>{chapter.readCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {chapter.wordCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FaClock className="mr-1 text-gray-400" />
                          <span>{formatDate(chapter.updatedAt || chapter.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            as="link" 
                            to={`/novels/${novelId}/chapters/${chapter.chapterNumber}/edit`}
                            variant="outline"
                            size="sm"
                            title="Edit Chapter"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            as="link" 
                            to={`/novels/${novelId}/chapters/${chapter.chapterNumber}`}
                            variant="outline"
                            size="sm"
                            title="View Chapter"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteChapter(chapter.chapterNumber)}
                            variant="danger"
                            size="sm"
                            title="Delete Chapter"
                            disabled={loading}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">{t('manageChapters.noChapters')}</p>
                      <Button 
                        as="link" 
                        to={`/novels/${novelId}/chapters/create`}
                        size="sm"
                      >
                        <FaPlus className="mr-2" /> {t('manageChapters.createFirstChapter')}
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
      
      {/* EPUB Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {importResult ? t('manageChapters.importSuccess') : t('manageChapters.importDialogTitle')}
                </h3>
                <button
                  type="button"
                  onClick={closeImportModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-4">
                {importResult ? (
                  // Import Success View
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('manageChapters.importSuccess')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('manageChapters.importStats').replace('{imported}', importResult.imported).replace('{total}', importResult.totalChapters)}
                    </p>
                    
                    {/* Errors (if any) */}
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="mt-4 text-left">
                        <details>
                          <summary className="text-sm text-yellow-600 dark:text-yellow-400 cursor-pointer flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            {t('manageChapters.viewDetailsAndErrors')}
                          </summary>
                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-md text-xs text-gray-600 dark:text-gray-400">
                            <h4 className="font-semibold mb-1">{t('manageChapters.errorsList')}</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {importResult.errors.map((error, index) => (
                                <li key={index}>
                                  {t('manageChapters.errorInChapter')
                                    .replace('{chapter}', error.chapterNumber)
                                    .replace('{error}', error.error)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                ) : (
                  // Import Form View
                  <div>
                    {/* File Upload Area */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('manageChapters.selectEpubFile')}
                      </label>
                      <div
                        className={`border-2 border-dashed ${epubFile ? 'border-indigo-300 dark:border-indigo-700' : 'border-gray-300 dark:border-gray-700'} rounded-md p-4 text-center cursor-pointer`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="application/epub+zip"
                          className="hidden"
                        />
                        {epubFile ? (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium">{epubFile.name}</p>
                            <p className="text-xs mt-1">
                              {(epubFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>{t('manageChapters.dragAndDrop')}</p>
                            <p className="text-xs mt-1 text-indigo-600 dark:text-indigo-400">
                              {t('manageChapters.selectFile')}
                            </p>
                          </div>
                        )}
                      </div>
                      {importError && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {importError}
                        </p>
                      )}
                    </div>
                    
                    {/* Import Options */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('manageChapters.importOptions')}
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="overwrite"
                            checked={importOptions.overwrite}
                            onChange={handleOptionChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {t('manageChapters.overwriteExisting')}
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="draft"
                            checked={importOptions.draft}
                            onChange={handleOptionChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {t('manageChapters.importAsDrafts')}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                {importResult ? (
                  <Button onClick={closeImportModal}>
                    {t('manageChapters.close')}
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={closeImportModal}
                    >
                      {t('manageChapters.cancel')}
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={!epubFile || importing}
                    >
                      {importing ? t('manageChapters.importing') : t('manageChapters.import')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageChaptersPage;