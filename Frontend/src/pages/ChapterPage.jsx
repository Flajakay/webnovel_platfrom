import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NovelService from '../services/novel.service';
import ChapterService from '../services/chapter.service';
import LibraryService from '../services/library.service';
import ChapterReader from '../components/chapter/ChapterReader';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const ChapterPage = () => {
  const { novelId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [novel, setNovel] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const chapterNum = parseInt(chapterNumber);
  
  // Fetch novel and chapter data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch novel details
        const novelResponse = await NovelService.getNovelById(novelId);
        if (novelResponse.status === 'success' && novelResponse.data) {
          setNovel(novelResponse.data);
        }
        
        // Fetch chapter
        const chapterResponse = await ChapterService.getChapter(novelId, chapterNum);
        if (chapterResponse.status === 'success' && chapterResponse.data) {
          setChapter(chapterResponse.data);
        }
        
        // Update last read chapter in library if user is logged in
        if (currentUser) {
          try {
            // Check if novel is in library
            const checkResponse = await LibraryService.checkInLibrary(novelId);
            
            if (checkResponse.data.status === 'success' && 
                checkResponse.data.data && 
                checkResponse.data.data.inLibrary) {
              // Novel is in library, update last read chapter
              await LibraryService.updateLastReadChapter(novelId, chapterNum);
            } else {
              // Not in library, add it
              await LibraryService.addToLibrary(novelId, 'READING');
              await LibraryService.updateLastReadChapter(novelId, chapterNum);
            }
          } catch (err) {
            console.error('Failed to update library status:', err);
          }
        }
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [novelId, chapterNum, currentUser]);
  
  // Navigation functions
  const goToNextChapter = () => {
    const nextChapterNumber = chapter?.navigation?.nextChapter;
    if (nextChapterNumber) {
      navigate(`/novels/${novelId}/chapters/${nextChapterNumber}`);
    }
  };
  
  const goToPrevChapter = () => {
    const prevChapterNumber = chapter?.navigation?.prevChapter;
    if (prevChapterNumber != null && prevChapterNumber > 0) {
      navigate(`/novels/${novelId}/chapters/${prevChapterNumber}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('chapterPage.loadingChapter')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate(`/novels/${novelId}`)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {t('chapterPage.backToNovel')}
          </button>
        </div>
      </div>
    );
  }
  
  // Check if we have navigation data
  const hasNextChapter = !!chapter?.navigation?.nextChapter;
  const hasPrevChapter = !!chapter?.navigation?.prevChapter;
  
  return (
    <ChapterReader
      chapter={chapter}
      novel={novel}
      nextChapter={hasNextChapter ? goToNextChapter : null}
      prevChapter={hasPrevChapter ? goToPrevChapter : null}
    />
  );
};

export default ChapterPage;