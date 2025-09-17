// Function to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Function to truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text;
};

// Function to calculate reading time
export const calculateReadingTime = (wordCount) => {
  const wordsPerMinute = 200; // Average reading speed
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

// Function to get a color based on rating
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-emerald-500';
  if (rating >= 4) return 'text-green-500';
  if (rating >= 3) return 'text-yellow-500';
  if (rating >= 2) return 'text-orange-500';
  return 'text-red-500';
};

// Function to generate a placeholder image if cover is not available
export const getImagePlaceholder = (title) => {
  // Generate a color based on the title
  const hash = title.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const color = `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
  
  // Get initials from title (up to 2 characters)
  const initials = title
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  return { color, initials };
};
