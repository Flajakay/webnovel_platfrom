import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const SectionHeader = ({ title, viewAllLink, viewAllText }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {viewAllLink && (
        <Link 
          to={viewAllLink} 
          className="text-indigo-600 dark:text-indigo-400 flex items-center hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          {viewAllText} <FaArrowRight className="ml-1" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;