// Library Status Constants
export const LIBRARY_STATUS = {
  WILL_READ: 'WILL_READ',
  READING: 'READING',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  DROPPED: 'DROPPED'
};

// Library Status Display Text
export const LIBRARY_STATUS_TEXT = {
  [LIBRARY_STATUS.WILL_READ]: 'Want to Read',
  [LIBRARY_STATUS.READING]: 'Currently Reading',
  [LIBRARY_STATUS.COMPLETED]: 'Completed',
  [LIBRARY_STATUS.ON_HOLD]: 'On Hold',
  [LIBRARY_STATUS.DROPPED]: 'Dropped'
};

// Novel Status Constants
export const NOVEL_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  HIATUS: 'hiatus'
};

// Novel Status Display Text
export const NOVEL_STATUS_TEXT = {
  [NOVEL_STATUS.ONGOING]: 'Ongoing',
  [NOVEL_STATUS.COMPLETED]: 'Completed',
  [NOVEL_STATUS.HIATUS]: 'On Hiatus'
};

// Chapter Status Constants
export const CHAPTER_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

// Default Genres
export const GENRES = [
	'Fantasy',
	'Science Fiction',
	'Kryminał',
	'Thriller',
	'Romans',
	'Horror',
	'Przygoda',
	'Historyczny',
	'Dramat',
	'Komedia',
	'Akcja',
	'Okruchy życia',
	'Nadprzyrodzony',
	'Sportowy',
	'Psychologiczny'
];

// Reader Theme Options
export const READER_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SEPIA: 'sepia'
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Recently Added' },
  { value: 'updatedAt', label: 'Recently Updated' },
  { value: 'viewCount', label: 'Most Viewed' },
  { value: 'calculatedStats.averageRating', label: 'Highest Rated' },
  { value: 'totalChapters', label: 'Chapter Count' }
];