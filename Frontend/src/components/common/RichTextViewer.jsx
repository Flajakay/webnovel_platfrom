import React from 'react';

const RichTextViewer = ({ content, className = '' }) => {
  return (
    <div 
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextViewer;