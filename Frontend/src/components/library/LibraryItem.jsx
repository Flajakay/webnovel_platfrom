import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaBookOpen, FaEllipsisH } from 'react-icons/fa';
import { getImagePlaceholder } from '../../utils/helpers';
import NovelService from '../../services/novel.service';
import { useLanguage } from '../../context/LanguageContext';

const LibraryItem = ({ item, onStatusChange, onRemove }) => {
  // Ensure item has the expected structure
  if (!item || !item.novel) return null;
  
  const { t } = useLanguage();
  const { novel, status, lastReadChapter } = item;
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  // Get novel ID (supporting both id and _id formats)
  const novelId = novel.id || novel._id || '';
  
  // Generate placeholder if no cover
  const placeholder = getImagePlaceholder(novel.title);
  
  // Determine if we have a cover image
  const hasCover = novel.hasCover;
  
  // Get cover URL if available
  const coverUrl = hasCover ? NovelService.getNovelCoverUrl(novelId) : null;
  
  // Status display text and classes
  const statusInfo = {
    WILL_READ: {
      text: t('library.willRead'),
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    READING: {
      text: t('library.reading'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    COMPLETED: {
      text: t('library.completed'),
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    },
    ON_HOLD: {
      text: t('library.onHold'),
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    DROPPED: {
      text: t('library.dropped'),
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
  };
  
  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(novelId, newStatus);
    }
    setMenuOpen(false);
  };
  
  // Handle remove from library
  const handleRemove = () => {
    if (onRemove) {
      onRemove(novelId);
    }
    setMenuOpen(false);
  };
  
  // Get author info
  const authorName = novel.author?.username || t('novel.unknown');
  const authorId = novel.author?.id || novel.author?._id || '';
  
  // Get status info
  const currentStatus = status || 'WILL_READ';
  const currentStatusInfo = statusInfo[currentStatus] || statusInfo.WILL_READ;
  
  // Get total chapters
  const totalChapters = novel.totalChapters || 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-visible">
      <div className="flex">
        {/* Cover */}
        <Link to={`/novels/${novelId}`} className="flex-shrink-0 w-24 sm:w-32">
          {hasCover ? (
            <img 
              src={coverUrl} 
              alt={novel.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.backgroundColor = placeholder.color;
                e.target.src = '';
                e.target.alt = placeholder.initials;
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: placeholder.color }}
            >
              {placeholder.initials}
            </div>
          )}
        </Link>
        
        {/* Details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/novels/${novelId}`} className="block">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1">
                  {novel.title}
                </h3>
              </Link>
              
              <Link to={authorId ? `/authors/${authorId}` : '#'} className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                {t('novel.by')} {authorName}
              </Link>
              
              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="mr-3">{(novel.calculatedStats?.averageRating || 0).toFixed(1)}</span>
                <FaBookOpen className="mr-1" />
                <span>{totalChapters} {totalChapters === 1 ? t('novel.chapter') : t('novel.chapters')}</span>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                aria-label="Options"
              >
                <FaEllipsisH />
              </button>
              
              {menuOpen && (
                <>
                  {/* Backdrop to detect clicks outside dropdown */}
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                  
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-visible">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('library.changeStatus')}
                    </div>
                  
                  {Object.entries(statusInfo).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(key)}
                      className={`w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${currentStatus === key ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                    >
                      {info.text}
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  
                  <button
                    onClick={handleRemove}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('library.removeFromLibrary')}
                  </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center justify-between">
            <div className="mt-2">
              <span className={`inline-block text-xs px-2 py-1 rounded-full ${currentStatusInfo.color}`}>
                {currentStatusInfo.text}
              </span>
              
              {currentStatus === 'READING' && lastReadChapter > 0 && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {t('library.lastRead')} {lastReadChapter} / {totalChapters}
                </span>
              )}
            </div>
            
            <div className="mt-2">
              {currentStatus === 'READING' && lastReadChapter > 0 ? (
                <Link 
                  to={`/novels/${novelId}/chapters/${lastReadChapter}`}
                  className="inline-block text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {t('library.continueReading')}
                </Link>
              ) : (
                <Link 
                  to={`/novels/${novelId}`}
                  className="inline-block text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {currentStatus === 'WILL_READ' ? t('library.startReading') : t('library.viewNovel')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryItem;