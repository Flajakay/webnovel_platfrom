import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import NovelService from '../services/novel.service';
import NovelCard from '../components/novel/NovelCard';
import Layout from '../components/layout/Layout';
import MobileNavigation from '../components/layout/MobileNavigation';
import Button from '../components/common/Button';
import { useLanguage } from '../context/LanguageContext';

const BrowsePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryParams = new URLSearchParams(location.search);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [genre, setGenre] = useState(queryParams.get('genre') || '');
  const [status, setStatus] = useState(queryParams.get('status') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sort') || 'recent');
  const [sortOrder, setSortOrder] = useState(queryParams.get('order') || 'desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Results states
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Available genres and statuses
  const genres = [
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
  
  const statuses = [
    { value: 'ongoing', label: t('browsePage.statuses.ongoing') },
    { value: 'completed', label: t('browsePage.statuses.completed') }
];
  
  const sortOptions = [
    { value: 'recent', label: t('browsePage.sortOptions.recentlyAdded') },
    { value: 'viewCount', label: t('browsePage.sortOptions.mostViewed') },
    { value: 'calculatedStats.averageRating', label: t('browsePage.sortOptions.highestRated') },
    { value: 'totalChapters', label: t('browsePage.sortOptions.chapterCount') }
  ];
  
  // Fetch novels based on filters
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = {
          page,
          limit: 12
        };
        
        if (searchQuery) params.q = searchQuery;
        if (genre) params.genre = genre;
        if (status) params.status = status;
        if (sortBy) params.sort = sortBy;
        if (sortOrder) params.order = sortOrder;
        
        const response = await NovelService.getNovels(params);
        
        if (response.status === 'success' && response.data) {
          // Check if the data structure has nested data array
          const novelsData = response.data.data || response.data;
          setNovels(Array.isArray(novelsData) ? novelsData : []);
          
          // Set total pages from response metadata
          const pagination = response.data.pagination || response.data.meta;
          if (pagination) {
            setTotalPages(pagination.totalPages || pagination.pages || 1);
          } else {
            setTotalPages(1);
          }
        } else {
          setNovels([]);
          setTotalPages(1);
        }
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNovels();
  }, [page, searchQuery, genre, status, sortBy, sortOrder]);
  
  // Update URL with query parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (genre) params.set('genre', genre);
    if (status) params.set('status', status);
    if (sortBy) params.set('sort', sortBy);
    if (sortOrder) params.set('order', sortOrder);
    if (page > 1) params.set('page', page.toString());
    
    navigate(`/browse?${params.toString()}`, { replace: true });
  }, [searchQuery, genre, status, sortBy, sortOrder, page, navigate]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setGenre('');
    setStatus('');
    setSortBy('recent');
    setSortOrder('desc');
    setPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };
  
  return (
    <Layout>
      <div className="pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('browsePage.title')}</h1>
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden mr-2"
                aria-label="Toggle filters"
              >
                <FaFilter />
              </Button>
              {/* Reset button - only show on desktop when filters are active */}
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className={`desktop-only ${!searchQuery && !genre && !status && sortBy === 'recent' && sortOrder === 'desc' ? 'hidden' : ''}`}
              >
                <FaTimes className="mr-2" /> {t('browsePage.reset')}
              </Button>
            </div>
          </div>
          
          <div className="md:grid md:grid-cols-4 md:gap-6">
            {/* Filters - Desktop */}
            <div className="hidden sm:block sm:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sticky top-4">
                <h2 className="font-medium text-gray-900 dark:text-white mb-4">{t('browsePage.filters')}</h2>
                
                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('browsePage.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                      type="submit" 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </form>
                
                {/* Genre Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('browsePage.genre')}
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      setPage(1); // Reset to first page on filter change
                    }}
                    className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{t('browsePage.allGenres')}</option>
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                
                {/* Status Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('browsePage.status')}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1); // Reset to first page on filter change
                    }}
                    className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{t('browsePage.allStatuses')}</option>
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('browsePage.sortBy')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1); // Reset to first page on filter change
                    }}
                    className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('browsePage.order')}
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 px-3 py-2 text-sm rounded-md ${
                        sortOrder === 'desc'
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t('browsePage.descending')}
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 px-3 py-2 text-sm rounded-md ${
                        sortOrder === 'asc'
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t('browsePage.ascending')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters - Mobile */}
            {showFilters && (
              <div className="sm:hidden fixed inset-0 bg-gray-900/70 z-50 flex items-center justify-center p-4">
                {/* Backdrop that closes modal */}
                <div 
                  className="absolute inset-0" 
                  onClick={() => setShowFilters(false)}
                  onTouchEnd={() => setShowFilters(false)}
                  aria-hidden="true"
                ></div>
                
                {/* Modal content - prevent event bubbling */}
                <div 
                  className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('browsePage.filters')}</h3>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
                        type="button"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={t('browsePage.searchPlaceholder')}
                          value={searchQuery}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSearchQuery(e.target.value);
                          }}
                          onFocus={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPage(1);
                          }}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                        >
                          <FaSearch />
                        </button>
                      </div>
                    </div>
                    
                    {/* Genre Filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('browsePage.genre')}
                      </label>
                      <select
                        value={genre}
                        onChange={(e) => {
                          e.stopPropagation();
                          setGenre(e.target.value);
                          setPage(1);
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">{t('browsePage.allGenres')}</option>
                        {genres.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Status Filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('browsePage.status')}
                      </label>
                      <select
                        value={status}
                        onChange={(e) => {
                          e.stopPropagation();
                          setStatus(e.target.value);
                          setPage(1);
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">{t('browsePage.allStatuses')}</option>
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Sort Options */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('browsePage.sortBy')}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSortBy(e.target.value);
                          setPage(1);
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Sort Order */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('browsePage.order')}
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortOrder('desc');
                          }}
                          onTouchEnd={(e) => {
                            e.stopPropagation();
                            setSortOrder('desc');
                          }}
                          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                            sortOrder === 'desc'
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {t('browsePage.descending')}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortOrder('asc');
                          }}
                          onTouchEnd={(e) => {
                            e.stopPropagation();
                            setSortOrder('asc');
                          }}
                          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                            sortOrder === 'asc'
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {t('browsePage.ascending')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetFilters();
                        }}
                        className="flex-1"
                        type="button"
                      >
                        {t('browsePage.resetFilters')}
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFilters(false);
                        }}
                        type="button"
                      >
                        {t('browsePage.applyFilters')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Results */}
            <div className="sm:col-span-3">
              {/* Active Filters */}
              {(searchQuery || genre || status || sortBy !== 'recent' || sortOrder !== 'desc') && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('browsePage.activeFilters')}</span>
                    
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                        {t('browsePage.search')}: {searchQuery}
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    
                    {genre && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                        {t('browsePage.genre')}: {genre}
                        <button
                          onClick={() => setGenre('')}
                          className="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    
                    {status && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                        {t('browsePage.status')}: {statuses.find(s => s.value === status)?.label}
                        <button
                          onClick={() => setStatus('')}
                          className="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    
                    {(sortBy !== 'recent' || sortOrder !== 'desc') && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                        {t('browsePage.sort')}: {sortOptions.find(s => s.value === sortBy)?.label} ({sortOrder === 'desc' ? t('browsePage.descending') : t('browsePage.ascending')})
                        <button
                          onClick={() => {
                            setSortBy('recent');
                            setSortOrder('desc');
                          }}
                          className="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Novel List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">{t('browsePage.loadingNovels')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    {t('common.tryAgain')}
                  </Button>
                </div>
              ) : novels.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">{t('browsePage.noNovelsFound')}</p>
                  <Button onClick={handleResetFilters} className="mt-4">
                    {t('browsePage.resetFilters')}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {novels.map(novel => (
                      <NovelCard key={novel._id} novel={novel} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className={`px-3 py-1 rounded-md ${
                            page === 1
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {t('browsePage.previous')}
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          
                          // Show limited page numbers with ellipsis
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= page - 1 && pageNumber <= page + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-1 rounded-md ${
                                  page === pageNumber
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            (pageNumber === 2 && page > 3) ||
                            (pageNumber === totalPages - 1 && page < totalPages - 2)
                          ) {
                            return <span key={pageNumber}>...</span>;
                          } else {
                            return null;
                          }
                        })}
                        
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                          className={`px-3 py-1 rounded-md ${
                            page === totalPages
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {t('browsePage.next')}
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default BrowsePage;