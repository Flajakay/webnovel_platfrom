import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Button from '../common/Button';

const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  initialValue = '', 
  placeholder = 'Napisz coś...', 
  isEdit = false 
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate content
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    if (content.length > 1000) {
      setError('Comment is too long (maximum 1000 characters)');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Submit the comment
      const result = await onSubmit(content);
      
      // Reset form if not editing
      if (!isEdit) {
        setContent('');
      }
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle content change
  const handleChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
        rows={3}
        disabled={isSubmitting}
      />
      
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      <div className="flex justify-end mt-2 space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              {isEdit ? 'Saving...' : 'Submitting...'}
            </>
          ) : (
            isEdit ? 'Wyślij' : 'Wyślij'
          )}
        </Button>
      </div>
      
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
        {content.length}/1000 characters
      </p>
    </form>
  );
};

export default CommentForm;