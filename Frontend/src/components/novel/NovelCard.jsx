import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaBookOpen, FaEye } from 'react-icons/fa';
import { getImagePlaceholder, truncateText } from '../../utils/helpers';
import NovelService from '../../services/novel.service';
import { useLanguage } from '../../context/LanguageContext';

const NovelCard = ({ novel, compact = false }) => {
  const { t } = useLanguage();
  if (!novel) return null;
  
  const { title, author, description, genres, calculatedStats, totalChapters, viewCount } = novel;
  
  // Make sure we have an author object that's not null
  const authorName = author?.username || t('novel.unknown');
  const authorId = author?.id || author?._id || '';
  
  // Get novel ID (supporting both id and _id formats)
  const novelId = novel.id || novel._id || '';
  
  // Generate placeholder if no cover
  const placeholder = getImagePlaceholder(title);
  
  // Determine if we have a cover image by checking if the cover property exists
  // We check if cover exists and isn't null/undefined/empty string
  const hasCover = !!novel.cover;
  
  // Get cover URL if available
  const coverUrl = hasCover ? NovelService.getNovelCoverUrl(novelId) : null;
  
  if (compact) {
    return (
      <Link to={`/novels/${novelId}`} className="flex items-start p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="flex-shrink-0 w-12 h-16 rounded-md overflow-hidden">
          {hasCover ? (
            <img 
              src={coverUrl} 
              alt={title} 
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
              className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: placeholder.color }}
            >
              {placeholder.initials}
            </div>
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('novel.by')} {authorName}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="mr-2">{(calculatedStats?.averageRating || 0).toFixed(1)}</span>
            <FaBookOpen className="mr-1" />
            <span className="mr-2">{totalChapters || 0}</span>
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <Link to={`/novels/${novelId}`} className="block">
        <div className="relative aspect-w-2 aspect-h-3 w-full md:aspect-h-3 aspect-h-2 max-h-48 md:max-h-none">
          {hasCover ? (
            <img 
              src={coverUrl} 
              alt={title} 
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
              className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: placeholder.color }}
            >
              {placeholder.initials}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-3 md:p-3 flex-1 flex flex-col">
        <Link to={`/novels/${novelId}`} className="block">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1">
            {title}
          </h3>
        </Link>
        
        <Link to={authorId ? `/authors/${authorId}` : '#'} className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mt-1">
          {t('novel.by')} {authorName}
        </Link>
        
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-2 line-clamp-2 md:line-clamp-2">
          {truncateText(description || t('novel.noDescription'), 150)}
        </p>
        
        <div className="mt-2 md:mt-3 flex flex-wrap gap-1">
          {genres && genres.slice(0, 3).map((genre, index) => (
            <Link 
              key={index} 
              to={`/browse?genre=${genre}`}
              className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900"
            >
              {genre}
            </Link>
          ))}
          {genres && genres.length > 3 && (
            <span className="inline-block text-xs text-gray-500 dark:text-gray-400 px-1 py-1">
              +{genres.length - 3}
            </span>
          )}
        </div>
        
		<div className="mt-auto pt-2 md:pt-3 flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 gap-3">
		  <div className="flex items-center">
			<FaStar className="text-yellow-400 mr-1" />
			<span>{(calculatedStats?.averageRating || 0).toFixed(1)}</span>
		  </div>
		  <div className="flex items-center">
			<FaBookOpen className="mr-1" />
			<span>{totalChapters || 0} <span className="hidden md:inline"></span></span>
		  </div>
		  <div className="flex items-center">
			<FaEye className="mr-1" />
			<span>{viewCount || 0} <span className="hidden md:inline"></span></span>
		  </div>
		</div>
      </div>
    </div>
  );
};

export default NovelCard;