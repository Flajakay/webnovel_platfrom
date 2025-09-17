import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, onChange, size = 'md', readOnly = false, showValue = false }) => {
  const [rating, setRating] = useState(value || 0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Update internal rating when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setRating(value);
    }
  }, [value]);
  
  // Size classes for stars
  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  // Handle star click
  const handleClick = (newRating) => {
    if (readOnly) return;
    
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };
  
  // Handle mouse enter on star
  const handleMouseEnter = (hoveredRating) => {
    if (readOnly) return;
    setHoverRating(hoveredRating);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };
  
  // Render stars
  const renderStars = () => {
    const stars = [];
    const activeRating = hoverRating || rating;
    
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= activeRating;
      
      stars.push(
        <span
          key={i}
          className={`${isActive ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${!readOnly && 'cursor-pointer'}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {isActive ? <FaStar className={sizeClass[size]} /> : <FaRegStar className={sizeClass[size]} />}
        </span>
      );
    }
    
    return stars;
  };
  
  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        {renderStars()}
      </div>
      
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;