/**
 * Format error messages from API responses
 * @param {Error} error - The error object
 * @returns {string} Formatted error message
 */
export const formatApiError = (error) => {
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  const { status, data } = error.response;

  // Handle specific error status codes
  switch (status) {
    case 400:
      // Bad request - usually validation errors
      if (data.message) {
        return data.message;
      }
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }
      return 'Invalid request. Please check your input and try again.';
    
    case 401:
      return 'Authentication required. Please log in again.';
    
    case 403:
      return 'You do not have permission to perform this action.';
    
    case 404:
      return 'The requested resource was not found.';
    
    case 409:
      return 'This action conflicts with the current state.';
    
    case 422:
      // Validation errors
      if (data.message) {
        return data.message;
      }
      if (data.errors && typeof data.errors === 'object') {
        return Object.values(data.errors).flat().join(', ');
      }
      return 'The provided data was invalid.';
    
    case 429:
      return 'Too many requests. Please try again later.';
    
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again later.';
    
    default:
      return data.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Extracts validation errors from API responses
 * @param {Error} error - The error object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const extractValidationErrors = (error) => {
  if (!error.response || !error.response.data) {
    return {};
  }

  const { data } = error.response;

  if (data.errors && typeof data.errors === 'object') {
    return data.errors;
  }

  return {};
};

/**
 * Handles API errors with a callback for specific actions
 * @param {Error} error - The error object
 * @param {Function} setError - Function to set the error message
 * @param {Function} [onUnauthorized] - Optional callback for 401 errors
 */
export const handleApiError = (error, setError, onUnauthorized) => {
  if (error.response && error.response.status === 401 && onUnauthorized) {
    onUnauthorized();
    return;
  }

  setError(formatApiError(error));
};