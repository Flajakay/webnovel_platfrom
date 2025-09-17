import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Write something...', 
  readOnly = false,
  height = '300px'
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [editorValue, setEditorValue] = useState(value);

  // Only render on client side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update local state when prop value changes
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value);
    }
  }, [value]);

  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  // Toolbar configuration
  const modules = {
    toolbar: readOnly ? false : [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ['clean']
    ]
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'header',
    'align'
  ];

  // Show loading state until component mounts
  if (!isMounted) {
    return (
      <div 
        style={{ height }}
        className="border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
      >
        <span className="text-gray-500 dark:text-gray-400">Loading editor...</span>
      </div>
    );
  }

  return (
    <div style={{ height }} className="react-quill-container">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={modules}
        formats={formats}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default RichTextEditor;