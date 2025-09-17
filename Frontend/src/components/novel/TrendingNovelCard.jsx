import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import NovelService from '../../services/novel.service';

const TrendingNovelCard = ({ novel }) => {
  const { t } = useLanguage();
  
  if (!novel) return null;
  
  // Get novel ID (handles both id and _id)
  const novelId = novel.id || novel._id;
  
  // Get cover URL
  const coverUrl = novel.hasCover 
    ? NovelService.getNovelCoverUrl(novelId)
    : '/images/default-cover.jpg';
  
  // Limit description length
  const truncatedDescription = novel.description && novel.description.length > 150
    ? `${novel.description.substring(0, 150)}...`
    : novel.description || t('novel.noDescription');
  
  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden h-32">
      {/* Cover Image */}
      <div className="w-1/3 flex-shrink-0">
        <Link to={`/novels/${novelId}`}>
          <img 
            src={coverUrl} 
            alt={novel.title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/images/default-cover.jpg' }}
          />
        </Link>
      </div>
      
      {/* Novel Info */}
      <div className="w-2/3 p-3 flex flex-col justify-between">
        <div>
          <Link to={`/novels/${novelId}`}>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">{novel.title}</h3>
          </Link>
          
          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
            {truncatedDescription}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <div className="flex items-center">
            <FaEye className="mr-1" />
            <span>{novel.viewCount || 0} {t('novel.views')}</span>
          </div>
          
          <span>
            {novel.totalChapters > 0 
              ? `${novel.totalChapters} ${novel.totalChapters === 1 ? t('novel.chapter') : t('novel.chapters')}`
              : '0 ' + t('novel.chapters')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendingNovelCard;