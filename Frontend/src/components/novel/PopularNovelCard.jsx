import React from 'react';
import { Link } from 'react-router-dom';
import NovelService from '../../services/novel.service';

const PopularNovelCard = ({ novel }) => {
  if (!novel) return null;
  
  // Get novel ID (handles both id and _id)
  const novelId = novel.id || novel._id;
  
  // Get cover URL
  const coverUrl = novel.hasCover 
    ? NovelService.getNovelCoverUrl(novelId)
    : '/images/default-cover.jpg';
  
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden h-48">
      {/* Cover Image */}
      <div className="h-32 w-full relative">
        <Link to={`/novels/${novelId}`}>
          <img 
            src={coverUrl} 
            alt={novel.title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/images/default-cover.jpg' }}
          />
          
          {/* Status Badge */}
          {novel.status && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                novel.status === 'completed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {novel.status === 'completed' ? 'Completed' : 'Ongoing'}
              </span>
            </div>
          )}
          
          {/* View Count Badge */}
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/50 text-white">
              {novel.viewCount || 0}
            </span>
          </div>
        </Link>
      </div>
      
      {/* Novel Info */}
      <div className="p-2 flex flex-col flex-grow">
        <Link to={`/novels/${novelId}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{novel.title}</h3>
        </Link>
      </div>
    </div>
  );
};

export default PopularNovelCard;