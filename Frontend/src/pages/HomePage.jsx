import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight, FaBookOpen, FaStar, FaFire, FaClock, FaSearch,
  FaBookmark, FaEye, FaMagic, FaFeather, FaSpaceShuttle,
  FaPen, FaUserAstronaut, FaGlobe, FaQuoteRight
} from 'react-icons/fa';
import NovelService from '../services/novel.service';
import Layout from '../components/layout/Layout';
import MobileNavigation from '../components/layout/MobileNavigation';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { getImagePlaceholder, truncateText } from '../utils/helpers';

// Custom Home Novel Card - specifically for homepage display
const HomeNovelDisplay = ({ novel, featured = false }) => {
  const { t } = useLanguage();
  if (!novel) return null;

  const { title, author, description, genres, calculatedStats, totalChapters, viewCount } = novel;

  const authorName = author?.username || t('novel.unknown');
  const authorId = author?.id || author?._id || '';
  const novelId = novel.id || novel._id || '';

  const placeholder = getImagePlaceholder(title);
  const hasCover = !!novel.cover;
  const coverUrl = hasCover ? NovelService.getNovelCoverUrl(novelId) : null;

  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-900 to-indigo-900 shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="flex flex-col md:flex-row relative z-10">
          {/* Cover Image - larger for featured novels */}
          <div className="md:w-1/3 w-full h-52 md:h-auto relative">
            {hasCover ? (
              <img
                src={coverUrl}
                alt={title}
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

            {/* Featured Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-full shadow-lg">
                {t('homePage.featured')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:w-2/3 flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {genres && genres.slice(0, 2).map((genre, index) => (
                  <Link
                    key={index}
                    to={`/browse?genre=${genre}`}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              <Link to={`/novels/${novelId}`}>
                <h2 className="text-xl md:text-2xl font-bold mb-2 hover:text-indigo-300 transition">
                  {title}
                </h2>
              </Link>

              <Link to={authorId ? `/authors/${authorId}` : '#'} className="text-indigo-200 hover:text-white text-sm mb-3 inline-block">
                {t('novel.by')} {authorName}
              </Link>

              <p className="text-gray-200 mb-4 line-clamp-2 md:line-clamp-3">
                {truncateText(description || t('novel.noDescription'), 200)}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center"><FaStar className="text-amber-400 mr-1" /> {(calculatedStats?.averageRating || 0).toFixed(1)}</span>
                <span className="flex items-center"><FaBookOpen className="mr-1" /> {totalChapters || 0}</span>
                <span className="flex items-center"><FaEye className="mr-1" /> {viewCount || 0}</span>
              </div>

              <Button
                as="link"
                to={`/novels/${novelId}`}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-indigo-900"
              >
                {t('homePage.readNow')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard home novel display (for non-featured novels)
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl relative">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <Link to={`/novels/${novelId}`} className="block relative">
        <div className="relative aspect-w-2 aspect-h-3 w-full">
          {hasCover ? (
            <img
              src={coverUrl}
              alt={title}
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
              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: placeholder.color }}
            >
              {placeholder.initials}
            </div>
          )}

          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <h3 className="text-white font-semibold line-clamp-2">{title}</h3>
            <p className="text-gray-200 text-sm">{t('novel.by')} {authorName}</p>
          </div>
        </div>
      </Link>

      <div className="p-3 flex justify-between items-center bg-white dark:bg-gray-800 relative z-10">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 gap-3">
          <span className="flex items-center"><FaStar className="text-amber-400 mr-1" /> {(calculatedStats?.averageRating || 0).toFixed(1)}</span>
          <span className="flex items-center"><FaBookOpen className="mr-1" /> {totalChapters || 0}</span>
        </div>

        <Link
          to={`/novels/${novelId}`}
          className="text-indigo-600 dark:text-indigo-400 text-xs hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
        >
          {t('homePage.read')} <FaArrowRight className="inline ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

// Featured Genre Section Card
const GenreCard = ({ genre, count, icon: Icon }) => {
  const { t } = useLanguage();
  return (
    <Link
      to={`/browse?genre=${genre}`}
      className="group relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-gray-900 to-indigo-900 p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:opacity-30 transition-opacity">
        <Icon className="text-8xl text-white" />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-1">{genre}</h3>
        <p className="text-indigo-200 text-sm">{count} {t('homePage.stories')}</p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 flex items-center text-white text-sm">
          {t('homePage.explore')} <FaArrowRight className="ml-1" />
        </div>
      </div>
    </Link>
  );
};

// Animated Stats Counter
const AnimatedCounter = ({ value, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = parseInt(value);
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [value]);

  return (
    <div ref={counterRef} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
      <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
        <Icon className="text-2xl text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{count.toLocaleString()}</div>
      <div className="text-gray-600 dark:text-gray-300 text-sm">{label}</div>
    </div>
  );
};

// Writer Highlight Card
const WriterSpotlight = ({ writer, stats }) => {
  const { t } = useLanguage();
  const authorId = writer?.id || writer?._id || '';
  const placeholder = getImagePlaceholder(writer.username);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600/30 to-purple-600/30"></div>
      <div className="relative p-6 text-center">
        <div className="w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden relative z-10 mb-4">
          {writer.avatar ? (
            <img src={writer.avatar} alt={writer.username} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: placeholder.color }}
            >
              {placeholder.initials}
            </div>
          )}
        </div>

        <Link to={`/authors/${authorId}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 mb-1">
            {writer.username}
          </h3>
        </Link>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {writer.bio || t('homePage.defaultWriterBio')}
        </p>

        <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300 gap-4 mb-4">
          <span className="flex items-center"><FaBookOpen className="mr-1" /> {stats.novels} {t('homePage.novels')}</span>
          <span className="flex items-center"><FaStar className="text-amber-400 mr-1" /> {stats.rating.toFixed(1)}</span>
        </div>

        <Button
          as="link"
          to={`/authors/${authorId}`}
          variant="outline"
          size="sm"
          className="w-full border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
        >
          {t('homePage.viewProfile')}
        </Button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [recentNovels, setRecentNovels] = useState([]);
  const [popularNovels, setPopularNovels] = useState([]);
  const [genresHighlight, setGenresHighlight] = useState([]);
  const [topWriters, setTopWriters] = useState([]);

  // Genre icons mapping
  const genreIcons = {
    'Fantasy': FaMagic,
    'Romance': FaFeather,
    'Science Fiction': FaSpaceShuttle,
    'Mystery': FaSearch,
    'Adventure': FaGlobe
  };

  // Ref for scroll animations
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observeElements = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      sectionsRef.current.forEach(el => {
        if (el) observer.observe(el);
      });

      return observer;
    };

    const observer = observeElements();

    return () => {
      if (observer) {
        sectionsRef.current.forEach(el => {
          if (el) observer.unobserve(el);
        });
      }
    };
  }, [loading]);

  // Fetch novels
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get popular novels
        const popularResponse = await NovelService.getNovels({
          sort: 'viewCount',
          order: 'desc',
          limit: 6
        });

        // Get recent novels
        const recentResponse = await NovelService.getNovels({
          sort: 'recent',
          order: 'desc',
          limit: 6
        });

        // Get highest rated novels for featured
        const featuredResponse = await NovelService.getNovels({
          sort: 'calculatedStats.averageRating',
          order: 'desc',
          limit: 1
        });

        // Create genres highlight - fetch real data
        const genresWithIcons = {
          'Fantasy': FaMagic,
          'Science Fiction': FaSpaceShuttle,
          'Kryminał': FaSearch,
          'Thriller': FaSearch,
          'Romans': FaFeather,
          'Horror': FaMagic,
          'Przygoda': FaGlobe,
          'Historyczny': FaBookOpen,
          'Dramat': FaFeather,
          'Komedia': FaFeather,
          'Akcja': FaGlobe,
          'Okruchy życia': FaBookOpen,
          'Nadprzyrodzony': FaMagic,
          'Sportowy': FaGlobe,
          'Psychologiczny': FaSearch
        };

        // Fetch genre counts
        const genrePromises = Object.keys(genresWithIcons).map(async (genre) => {
          try {
            const response = await NovelService.getNovels({
              genre: genre,
              limit: 1 // We only need the count, not the actual novels
            });
            const count = response.data?.pagination?.total || response.data?.meta?.total || 0;
            return {
              name: genre,
              count: count,
              icon: genresWithIcons[genre]
            };
          } catch (error) {
            console.error(`Failed to fetch count for genre ${genre}:`, error);
            return {
              name: genre,
              count: 0,
              icon: genresWithIcons[genre]
            };
          }
        });

        const genresData = await Promise.all(genrePromises);
        // Sort by count and take top 5, but only include genres with at least 1 novel
        const topGenres = genresData
          .filter(genre => genre.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        // If we don't have enough genres with novels, fill with placeholder data
        if (topGenres.length < 5) {
          const remainingGenres = Object.keys(genresWithIcons)
            .filter(genre => !topGenres.find(g => g.name === genre))
            .slice(0, 5 - topGenres.length)
            .map(genre => ({
              name: genre,
              count: 0,
              icon: genresWithIcons[genre]
            }));
          topGenres.push(...remainingGenres);
        }
        
        setGenresHighlight(topGenres);

        // Sample top writers (in a real app, you'd fetch this from API)
        const mockWriters = [
          {
            _id: '1',
            username: 'CosmicScribe',
            bio: 'Crafting tales of interstellar wonder and cosmic adventure.',
            avatar: null,
            stats: { novels: 12, rating: 4.8 }
          },
          {
            _id: '2',
            username: 'StellarInk',
            bio: 'Building worlds of fantasy and magic one chapter at a time.',
            avatar: null,
            stats: { novels: 8, rating: 4.6 }
          },
          {
            _id: '3',
            username: 'NebulaNarrator',
            bio: 'Specializing in mystery thrillers with unexpected twists.',
            avatar: null,
            stats: { novels: 15, rating: 4.9 }
          },
          {
            _id: '4',
            username: 'GalaxyTales',
            bio: 'Passionate about sci-fi and visionary futures.',
            avatar: null,
            stats: { novels: 6, rating: 4.5 }
          }
        ];
        setTopWriters(mockWriters);


        setPopularNovels(popularResponse.data.data);
        setRecentNovels(recentResponse.data.data);
        setFeaturedNovels(featuredResponse.data.data);
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, [t]);

  return (
    <Layout>
      <div className="pb-16 md:pb-0">
        {/* Redesigned Hero Section - Creative Approach */}
        <div className="relative h-[60vh] max-h-[600px] min-h-[400px] md:h-[80vh] md:max-h-[700px] md:min-h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/home-1.webp"
              alt="Books background"
              className="w-full h-full object-cover"
			  style={{
				objectPosition: window.innerWidth < 768 ? '60% 20%' : 'center center'
			  }}
            />
          </div>

          {/* Overlay with angular design */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/80"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute -left-10 top-20 w-40 h-40 rounded-full bg-indigo-600/30 blur-3xl"></div>
          <div className="absolute right-10 bottom-40 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"></div>

          {/* Text Content with Creative Typography */}
          <div className="absolute inset-0 flex items-center">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl relative">
                {/* Creative heading with mixed styles */}
                <h1 className="mb-6">
                  <span className="block text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-300 to-white mb-2">
                    {t('homePage.heroTitle').split(' ')[0]}
                  </span>
                  <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-white/90">
                    {t('homePage.heroTitle').split(' ').slice(1).join(' ')}
                  </span>
                  <span className="absolute -right-4 -top-4 text-7xl md:text-8xl text-indigo-500/20 font-black">
                    "
                  </span>
                </h1>

                {/* Description with more interesting styling */}
                <p className="text-base md:text-xl mb-10 text-gray-300 max-w-2xl border-l-4 border-indigo-500 pl-4 italic">
                  {t('homePage.heroDescription')}
                </p>

                {/* Stylized Buttons */}
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <Button
                    as="link"
                    to="/browse"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 md:px-10 md:py-4 rounded-md transition-all hover:scale-105 shadow-lg text-sm md:text-base"
                  >
                    <span className="flex items-center">
                      {t('homePage.exploreStories')}
                      <FaArrowRight className="ml-2" />
                    </span>
                  </Button>
                  {!currentUser && (
                    <Button
                      as="link"
                      to="/register"
                      className="group relative overflow-hidden bg-transparent px-6 py-3 md:px-10 md:py-4 border border-gray-400 text-white rounded-md transition-all hover:border-white text-sm md:text-base"
                    >
                      <span className="relative z-10">{t('homePage.startWriting')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{t('homePage.loadingStories')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  {t('common.tryAgain')}
                </Button>
              </div>
            ) : (
              <>

                {/* Popular Genres - New Section */}
                <div
                  ref={el => sectionsRef.current[1] = el}
                  className="mb-16 opacity-0"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FaMagic className="text-indigo-500 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('homePage.exploreGenres')}</h2>
                    </div>
                    <Link
                      to="/browse"
                      className="text-indigo-600 dark:text-indigo-400 flex items-center hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      {t('homePage.viewAllGenres')} <FaArrowRight className="ml-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {genresHighlight.map((genre, index) => (
                      <GenreCard
                        key={index}
                        genre={genre.name}
                        count={genre.count}
                        icon={genre.icon}
                      />
                    ))}
                  </div>
                </div>



                {/* Popular Novels Section */}
                <div
                  ref={el => sectionsRef.current[3] = el}
                  className="mb-16 opacity-0"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FaStar className="text-amber-500 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('homePage.popularStories')}</h2>
                    </div>
                    <Link
                      to="/browse?sort=viewCount&order=desc"
                      className="text-indigo-600 dark:text-indigo-400 flex items-center hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      {t('homePage.viewAll')} <FaArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {popularNovels.map(novel => (
                      <HomeNovelDisplay key={novel.id || novel._id} novel={novel} />
                    ))}
                  </div>
                </div>

                {/* Recent Updates Section */}
                <div
                  ref={el => sectionsRef.current[4] = el}
                  className="mb-16 opacity-0"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FaClock className="text-purple-500 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('homePage.recentUpdates')}</h2>
                    </div>
                    <Link
                      to="/browse?sort=recent&order=desc"
                      className="text-indigo-600 dark:text-indigo-400 flex items-center hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      {t('homePage.viewAll')} <FaArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {recentNovels.map(novel => (
                      <HomeNovelDisplay key={novel.id || novel._id} novel={novel} />
                    ))}
                  </div>
                </div>



                {/* Reader Testimonials Section - New */}
                <div
                  ref={el => sectionsRef.current[6] = el}
                  className="mb-16 opacity-0"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FaQuoteRight className="text-indigo-500 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('homePage.readerTestimonials')}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Testimonial 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="absolute top-0 right-0 w-16 h-16 text-gray-200 dark:text-gray-700 opacity-40">
                        <FaQuoteRight className="w-full h-full" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {t('homePage.testimonial1.quote')}
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                            MC
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('homePage.testimonial1.author')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('homePage.testimonial1.role')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="absolute top-0 right-0 w-16 h-16 text-gray-200 dark:text-gray-700 opacity-40">
                        <FaQuoteRight className="w-full h-full" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {t('homePage.testimonial2.quote')}
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                            AP
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('homePage.testimonial2.author')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('homePage.testimonial2.role')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="absolute top-0 right-0 w-16 h-16 text-gray-200 dark:text-gray-700 opacity-40">
                        <FaQuoteRight className="w-full h-full" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {t('homePage.testimonial3.quote')}
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                            KW
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('homePage.testimonial3.author')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('homePage.testimonial3.role')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to action for authors */}
                <div
                  ref={el => sectionsRef.current[7] = el}
                  className="opacity-0"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl p-8 text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 -translate-x-1/2 translate-y-1/2"></div>

                    <div className="max-w-3xl mx-auto text-center relative z-10">
                      <h2 className="text-3xl font-bold mb-4">{t('homePage.startWritingJourneyTitle')}</h2>
                      <p className="text-lg mb-6">
                        {t('homePage.startWritingJourneyDescription')}
                      </p>
                      <Button
                        as="link"
                        to={currentUser ? "/dashboard" : "/register"}
                        variant="primary"
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-gray-100 hover:scale-105 transform transition-transform duration-300"
                      >
                        {currentUser ? t('homePage.goToDashboard') : t('homePage.startWritingCta')}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animated stars background */
        .stars-small,
        .stars-medium,
        .stars-large {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
          background-image:
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
          background-size: 550px 550px, 350px 350px, 250px 250px;
          background-position: 0 0, 40px 60px, 130px 270px;
          animation: stars 60s linear infinite;
        }

        .stars-medium {
          background-size: 400px 400px, 300px 300px, 200px 200px;
          background-position: 0 0, 30px 60px, 120px 220px;
          animation: stars 90s linear infinite;
        }

        .stars-large {
          background-size: 300px 300px, 200px 200px, 100px 100px;
          background-position: 0 0, 24px 48px, 80px 160px;
          animation: stars 120s linear infinite;
        }

        @keyframes stars {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-2000px);
          }
        }
      `}</style>

      <MobileNavigation />
    </Layout>
  );
};

export default HomePage;