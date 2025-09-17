import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaArrowLeft, FaArrowRight, FaList, FaFont, FaAdjust } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../context/LanguageContext';
import RichTextViewer from '../common/RichTextViewer';

const ChapterReader = ({ chapter, novel, nextChapter, prevChapter }) => {
  const { settings, updateSetting, getReaderStyle } = useTheme();
  const { t } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  
  // Ensure we have valid data
  if (!chapter || !novel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
        {t('chapterPage.chapterDataNotAvailable')}
        </div>
      </div>
    );
  }
  
  // Get novel ID (handle both id and _id)
  const novelId = novel.id || novel._id;
  
  // Reading settings
  const fontSizes = [14, 16, 18, 20, 22, 24];
  const lineHeights = [1.4, 1.6, 1.8, 2.0, 2.2];
  const fontFamilies = [
    { value: 'sans', label: t('chapterPage.sansSerif') },
    { value: 'serif', label: t('chapterPage.serif') },
    { value: 'mono', label: t('chapterPage.monospace') },
  ];

  // Format chapter content - let's handle both HTML and plain text
  let chapterContent = chapter?.content || '';
  
  // If the content doesn't appear to have HTML formatting, wrap it in paragraphs
  if (chapterContent && !chapterContent.includes('<') && !chapterContent.includes('>')) {
    chapterContent = chapterContent
      .split('\n\n')
      .filter(paragraph => paragraph.trim() !== '')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  }

  // Navigate to previous/next chapter
  const handleNavigation = (navigateCallback) => {
    if (navigateCallback) {
      navigateCallback();
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 pb-16 md:pb-0">
      {/* Chapter Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 px-4 py-2 flex items-center">
        <Link 
          to={`/novels/${novelId}`} 
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 w-10"
        >
          <FaArrowLeft className="text-lg" />
          <span className="truncate hidden">{novel.title}</span>
        </Link>
        
        <div className="text-center truncate flex-1 flex flex-col items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('chapterPage.chapter')} {chapter.chapterNumber}</span>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">{chapter.title}</h1>
        </div>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 w-10 text-right"
          aria-label="Reader settings"
        >
          <FaCog className="text-lg ml-auto" />
        </button>
      </div>
      
      {/* Reading Settings Panel */}
      {showSettings && (
        <div className="fixed top-14 right-0 w-full md:w-80 bg-white dark:bg-gray-800 shadow-lg z-20 p-4 rounded-b-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('chapterPage.readingSettings')}</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('chapterPage.fontSize')}
            </label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  const currentIndex = fontSizes.indexOf(settings.fontSize);
                  if (currentIndex > 0) {
                    updateSetting('fontSize', fontSizes[currentIndex - 1]);
                  }
                }}
                className="text-gray-600 dark:text-gray-300 p-1"
                disabled={settings.fontSize === fontSizes[0]}
              >
                <FaFont className="text-sm" />
              </button>
              <input 
                type="range" 
                min="0" 
                max={fontSizes.length - 1} 
                value={fontSizes.indexOf(settings.fontSize)} 
                onChange={(e) => updateSetting('fontSize', fontSizes[parseInt(e.target.value)])}
                className="w-full"
              />
              <button 
                onClick={() => {
                  const currentIndex = fontSizes.indexOf(settings.fontSize);
                  if (currentIndex < fontSizes.length - 1) {
                    updateSetting('fontSize', fontSizes[currentIndex + 1]);
                  }
                }}
                className="text-gray-600 dark:text-gray-300 p-1"
                disabled={settings.fontSize === fontSizes[fontSizes.length - 1]}
              >
                <FaFont className="text-lg" />
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('chapterPage.lineHeight')}
            </label>
            <div className="flex items-center space-x-2">
              <input 
                type="range" 
                min="0" 
                max={lineHeights.length - 1} 
                value={lineHeights.indexOf(settings.lineHeight)} 
                onChange={(e) => updateSetting('lineHeight', lineHeights[parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('chapterPage.fontFamily')}
            </label>
            <div className="flex flex-wrap gap-2">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  onClick={() => updateSetting('fontFamily', font.value)}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    settings.fontFamily === font.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
          
          
          <button
            onClick={() => setShowSettings(false)}
            className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-md"
          >
            {t('chapterPage.close')}
          </button>
        </div>
      )}
      
      {/* Chapter Content */}
      <div 
        className="pt-16 pb-16 px-4 md:px-0 max-w-3xl mx-auto"
        style={getReaderStyle()}
      >
        <div className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-800 dark:prose-p:text-gray-300 max-w-none">
          <style>{`
            .prose p + p {
              margin-top: 1.5em !important;
            }
          `}</style>
          <RichTextViewer content={chapterContent} />
        </div>
      </div>
      
      {/* Chapter Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-10 px-4 py-3 md:py-2 flex items-center justify-between">
        <button
          onClick={() => prevChapter && handleNavigation(prevChapter)}
          disabled={!prevChapter}
          className={`flex items-center ${
            prevChapter
              ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <FaArrowLeft className="mr-2" />
          <span className="hidden sm:inline">{t('chapterPage.previous')}</span>
        </button>
        
        <Link
          to={`/novels/${novelId}`}
          className="hidden md:flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <FaList className="mr-2" />
          <span>{t('chapterPage.chapters')}</span>
        </Link>
        
        <button
          onClick={() => nextChapter && handleNavigation(nextChapter)}
          disabled={!nextChapter}
          className={`flex items-center ${
            nextChapter
              ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">{t('chapterPage.next')}</span>
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ChapterReader;