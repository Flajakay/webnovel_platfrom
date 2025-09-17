import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaStar, FaEye, FaBookOpen, FaClock, FaHeart, FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import NovelService from '../services/novel.service';
import ChapterService from '../services/chapter.service';
import LibraryService from '../services/library.service';
import Layout from '../components/layout/Layout';
import ChapterList from '../components/chapter/ChapterList';
import Rating from '../components/common/Rating';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getImagePlaceholder } from '../utils/helpers';
import MobileNavigation from '../components/layout/MobileNavigation';
import CommentSection from '../components/comment/CommentSection';
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage

const NovelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage(); // Initialize t for translations

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [inLibrary, setInLibrary] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to refresh chapter list
  const refreshChapters = async () => {
    try {
      // Fetch chapters
      const chaptersResponse = await ChapterService.getChapters(id);
      if (chaptersResponse.status === 'success' && chaptersResponse.data) {
        // The chapters might be in data.chapters with metadata
        const chaptersData = chaptersResponse.data.chapters || chaptersResponse.data;
        setChapters(Array.isArray(chaptersData) ? chaptersData : []);
      }
    } catch (err) {
      console.error('Failed to refresh chapters:', err);
    }
  };

  // Handle chapter deletion
  const handleChapterDelete = async (chapterNumber) => {
    await refreshChapters();
  };

  // Load novel and chapters data
  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch novel details
        const novelResponse = await NovelService.getNovelById(id);
        if (novelResponse.status === 'success' && novelResponse.data) {
          setNovel(novelResponse.data);
        }

        // Fetch chapters
        const chaptersResponse = await ChapterService.getChapters(id);
        if (chaptersResponse.status === 'success' && chaptersResponse.data) {
          // The chapters might be in data.chapters with metadata
          const chaptersData = chaptersResponse.data.chapters || chaptersResponse.data;
          setChapters(Array.isArray(chaptersData) ? chaptersData : []);
        }

        // Increment view count
        await NovelService.incrementViewCount(id);

        // If user is logged in, check library status
        if (currentUser) {
          try {
            // Check if novel is in library
            const libraryResponse = await LibraryService.checkInLibrary(id);
            if (libraryResponse.data.status === 'success' && libraryResponse.data.data) {
              if (libraryResponse.data.data.inLibrary) {
                setInLibrary(true);
                setLibraryStatus(libraryResponse.data.data.status);
              }
            }
          } catch (err) {
            console.error('Failed to fetch library status:', err);
          }
        }
      } catch (err) {
        setError(t('novelDetails.loadError')); // Translated error message
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelData();
  }, [id, currentUser, t]); // Add t to dependency array

  // Handle adding/removing from library
  const handleLibraryToggle = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/novels/${id}` } });
      return;
    }

    try {
      if (inLibrary) {
        await LibraryService.removeFromLibrary(id);
        setInLibrary(false);
        setLibraryStatus(null);
      } else {
        const response = await LibraryService.addToLibrary(id, 'WILL_READ');
        if (response.data.status === 'success') {
          setInLibrary(true);
          setLibraryStatus('WILL_READ');
        }
      }
    } catch (err) {
      console.error('Failed to update library:', err);
    }
  };

  // Handle rating change
  const handleRateNovel = async (rating) => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/novels/${id}` } });
      return;
    }

    try {
      const response = await NovelService.rateNovel(id, rating);
      if (response.status === 'success') {
        setUserRating(rating);

        // Update novel average rating
        const novelResponse = await NovelService.getNovelById(id);
        if (novelResponse.status === 'success') {
          setNovel(novelResponse.data);
        }

        setShowRating(false);
      }
    } catch (err) {
      console.error('Failed to rate novel:', err);
    }
  };

  // Generate placeholder if no cover
  const placeholder = novel ? getImagePlaceholder(novel.title) : { color: '#6366F1', initials: 'OP' };

  // Get cover URL if available
  const coverUrl = novel?.hasCover ? NovelService.getNovelCoverUrl(novel.id || novel._id) : null;

  // Check if current user is the author
  const isAuthor = currentUser && novel?.author &&
    ((novel.author.id && currentUser.id && novel.author.id === currentUser.id) ||
     (novel.author._id && currentUser._id && novel.author._id === currentUser._id));

  // Get author stats (novel count and avg rating) for the current novel's author
  const [authorStats, setAuthorStats] = useState({ novelCount: 0, avgRating: 0 });

  // Load author stats
  useEffect(() => {
    const fetchAuthorStats = async () => {
      if (!novel || !novel.author || !(novel.author.id || novel.author._id)) return;

      try {
        // FIX: Use the correct method for fetching novels by this author
        const authorId = novel.author.id || novel.author._id;
        const response = await NovelService.getNovelsByAuthor(authorId, {
          limit: 100  // Large enough to get all novels
        });

        if (response.data && response.data.data) {
          const authorNovels = Array.isArray(response.data.data) ? response.data.data : [];
          const novelCount = authorNovels.length;

          // Calculate average rating only for novels that have ratings
          let totalRating = 0;
          let ratedNovels = 0;

          authorNovels.forEach(novel => {
            if (novel.calculatedStats?.averageRating && novel.calculatedStats.averageRating > 0) {
              totalRating += novel.calculatedStats.averageRating;
              ratedNovels++;
            }
          });

          const avgRating = ratedNovels > 0 ? (totalRating / ratedNovels) : 0;

          setAuthorStats({
            novelCount: novelCount,
            avgRating: avgRating
          });
        }
      } catch (err) {
        console.error('Failed to fetch author stats:', err);
      }
    };

    fetchAuthorStats();
  }, [novel]);

  return (
    <Layout>
      <div className="pb-16 md:pb-0">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('novelDetails.loadingDetails')}</p> {/* Translated text */}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                {t('common.tryAgain')} {/* Translated button text */}
              </Button>
            </div>
          </div>
        ) : novel && (
          <>
            {/* Novel Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="md:flex">
                  {/* Cover Image */}
                  <div className="md:flex-shrink-0 mx-auto md:mx-0 w-48 md:w-56 h-64 md:h-80 overflow-hidden rounded-lg shadow-lg mb-6 md:mb-0 md:mr-8">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={novel.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.backgroundColor = placeholder.color;
                          e.target.src = '';
                          e.target.alt = placeholder.initials;
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                        style={{ backgroundColor: placeholder.color }}
                      >
                        {placeholder.initials}
                      </div>
                    )}
                  </div>

                  {/* Novel Info */}
                  <div className="md:flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{novel.title}</h1>

                    <p className="text-white/80 mb-4">
                      {t('novelDetails.by')} <span className="font-medium">{novel.author?.username}</span> {/* Translated text */}
                    </p>

                    <div className="flex flex-wrap gap-y-2 mb-4">
                      {novel.genres && novel.genres.map((genre, index) => (
                        <span key={index} className="mr-2 text-sm px-3 py-1 bg-white/20 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center text-sm mb-6">
                      <div className="flex items-center mr-6 mb-2">
                        <FaStar className="text-yellow-300 mr-1" />
                        <span>
                          {novel.calculatedStats?.averageRating?.toFixed(1) || '0.0'}
                          ({novel.calculatedStats?.ratingCount || 0})
                        </span>
                      </div>
                      <div className="flex items-center mr-6 mb-2">
                        <FaBookOpen className="mr-1" />
                        <span>{novel.totalChapters || 0} {t('novelDetails.chapters')}</span> {/* Translated text */}
                      </div>
                      <div className="flex items-center mr-6 mb-2">
                        <FaEye className="mr-1" />
                        <span>{novel.viewCount || 0} {t('novelDetails.views')}</span> {/* Translated text */}
                      </div>
                      <div className="flex items-center mb-2">
                        <FaClock className="mr-1" />
                        <span>{t('novelDetails.updated')} {formatDate(novel.updatedAt || novel.createdAt)}</span> {/* Translated text */}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {chapters.length > 0 && (
                        <Button
                        as="link"
                        to={`/novels/${novel.id || novel._id}/chapters/1`}
                        className="bg-white text-indigo-600 hover:bg-white/90 dark:bg-white dark:text-indigo-600 dark:hover:bg-gray-100"
                        >
                          {t('novelDetails.startReading')} {/* Translated button text */}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                        onClick={handleLibraryToggle}
                      >
                        {inLibrary ? (
                          <>
                            <FaBookmark className="mr-2" /> {t('novelDetails.inLibrary')} {/* Translated text */}
                          </>
                        ) : (
                          <>
                            <FaRegBookmark className="mr-2" /> {t('novelDetails.addToLibrary')} {/* Translated text */}
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                        onClick={() => setShowRating(!showRating)}
                      >
                        <FaStar className="mr-2" /> {t('novelDetails.rate')} {/* Translated button text */}
                      </Button>

                      {isAuthor && (
                        <Button
                          as="link"
                          to={`/novels/${novel.id || novel._id}/edit`}
                          variant="outline"
                          className="border-white text-white hover:bg-white/10"
                        >
                          <FaEdit className="mr-2" /> {t('novelDetails.editNovel')} {/* Translated button text */}
                        </Button>
                      )}
                    </div>

                    {/* Rating Popup */}
                    {showRating && (
                      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full md:w-64">
                        <p className="text-gray-900 dark:text-white mb-3">{t('novelDetails.yourRating')}</p> {/* Translated text */}
                        <Rating size="lg" value={userRating} onChange={handleRateNovel} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Novel Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="md:flex md:gap-8">
                {/* Left Column - Description */}
                <div className="md:w-2/3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('novelDetails.synopsis')}</h2> {/* Translated text */}
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {novel.description}
                      </p>
                    </div>
                  </div>

                  {/* Chapters List */}
                  <div className="mb-6">
                    {isAuthor && (
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('novelDetails.manageChapters')}</h2> {/* Translated text */}
                        <Button
                          as="link"
                          to={`/novels/${novel.id || novel._id}/chapters/create`}
                          size="sm"
                        >
                          {t('novelDetails.addChapter')} {/* Translated button text */}
                        </Button>
                      </div>
                    )}

                    <ChapterList
                      chapters={chapters}
                      novelId={novel.id || novel._id}
                      isAuthor={isAuthor}
                      onChapterDelete={handleChapterDelete}
                    />
                  </div>

                  {/* Comments Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <CommentSection novelId={novel.id || novel._id} />
                  </div>
                </div>

                {/* Right Column - Author & Stats */}
                <div className="md:w-1/3 mt-6 md:mt-0">
                  {/* Author Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('novelDetails.aboutAuthor')}</h3> {/* Translated text */}
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold mr-4">
                        {novel.author?.username.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <h4 className="font-medium text-lg text-gray-900 dark:text-white">{novel.author?.username || t('novelDetails.anonymous')}</h4> {/* Translated text */}
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{novel.author?.bio?.substring(0, 100) || t('novelDetails.noBioAvailable')}...</p> {/* Translated text */}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <FaBook className="mr-1 text-indigo-500" />
                        <span>{authorStats.novelCount} {authorStats.novelCount === 1 ? t('novelDetails.novel') : t('novelDetails.novels')}</span> {/* Translated text */}
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-1 text-indigo-500" />
                        <span>{authorStats.avgRating.toFixed(1)} {t('novelDetails.rating')}</span> {/* Translated text */}
                      </div>
                    </div>
                    <Button
                      as="link"
                      to={`/authors/${novel.author?.id || novel.author?._id}`}
                      variant="outline"
                      className="w-full justify-center"
                      size="sm"
                    >
                      {t('novelDetails.visitAuthorProfile')} {/* Translated button text */}
                    </Button>
                  </div>

                  {/* Novel Status */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('novelDetails.novelStatus')}</h3> {/* Translated text */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">{t('novelDetails.status')}</span> {/* Translated text */}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        novel.status === 'ongoing'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : novel.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {novel.status === 'ongoing' ? t('novelDetails.ongoing') :
                         novel.status === 'completed' ? t('novelDetails.completed') :
                         t('novelDetails.unknown')} {/* Translated text */}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">{t('novelDetails.totalChapters')}</span> {/* Translated text */}
                      <span className="font-medium text-gray-900 dark:text-white">{novel.totalChapters || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{t('novelDetails.published')}</span> {/* Translated text */}
                      <span className="text-gray-600 dark:text-gray-400">{formatDate(novel.createdAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {novel.tags && novel.tags.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('novelDetails.tags')}</h3> {/* Translated text */}
                      <div className="flex flex-wrap gap-2">
                        {novel.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <MobileNavigation />
    </Layout>
  );
};

export default NovelDetailsPage;