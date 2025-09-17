import React, { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';

const ImageUploader = ({ 
  initialImage = null, 
  onChange,
  onRemove,
  label = 'Cover Image', 
  className = '' 
}) => {
  const [preview, setPreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        if (onChange) onChange(file);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file (JPG, PNG, etc.)');
    }
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
          if (onChange) onChange(file);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file (JPG, PNG, etc.)');
      }
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onRemove) onRemove();
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto max-h-64 rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Drop an image here, or <span className="text-indigo-500">browse</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUploader;