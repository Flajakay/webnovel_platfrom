import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaBook, FaStar, FaCalendarAlt } from 'react-icons/fa';
import NovelService from '../services/novel.service';
import NovelCard from '../components/novel/NovelCard';
import Layout from '../components/layout/Layout';
import MobileNavigation from '../components/layout/MobileNavigation';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';

const AuthorPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(id);
        // FIX: Use the correct method for fetching novels by author
        const novelsResponse = await NovelService.getNovelsByAuthor(id, { 
          limit: 100  // Get all author's novels
        });
        
        if (novelsResponse.data && novelsResponse.data.data) {
          const novelsData = novelsResponse.data.data;
          setNovels(Array.isArray(novelsData) ? novelsData : []);
          
          // Extract author data from the first novel if available
          if (novelsData.length > 0 && novelsData[0].author) {
            setAuthor(novelsData[0].author);
          }
        } else {
          setNovels([]);
        }
      } catch (err) {
        setError('Nie udało się wczytać danych autora. Spróbuj ponownie później.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthorData();
  }, [id]);

  return (
    <Layout>
      <div className="pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Ładowanie profilu autora...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Spróbuj ponownie
              </Button>
            </div>
          ) : (
            <>
              {/* Author Profile Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Author Avatar */}
                  <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold">
                    {author?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {author?.username || 'Nieznany autor'}
                    </h1>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <FaBook className="mr-2 text-indigo-500" />
                        <span>{novels.length} {novels.length === 1 ? 'Powieść' : novels.length > 1 && novels.length < 5 ? 'Powieści' : 'Powieści'}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaStar className="mr-2 text-indigo-500" />
                        <span>
                          {(() => {
                            const novelsWithRating = novels.filter(novel => novel.calculatedStats?.averageRating && novel.calculatedStats.averageRating > 0);
                            const avgRating = novelsWithRating.length > 0 
                              ? (novelsWithRating.reduce((sum, novel) => sum + novel.calculatedStats.averageRating, 0) / novelsWithRating.length).toFixed(1)
                              : '0.0';
                            return avgRating;
                          })()} Średnia ocena
                        </span>
                      </div>
                      
                      {author?.createdAt && (
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-indigo-500" />
                          <span>Członek od {formatDate(author.createdAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    {author?.bio && (
                      <div className="mt-4 text-gray-700 dark:text-gray-300">
                        <p>{author.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Author's Novels */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {novels.length > 0 
                    ? `Powieści autorstwa ${author?.username || 'tego autora'}`
                    : `Nie znaleziono powieści autorstwa ${author?.username || 'tego autora'}`}
                </h2>
                
                {novels.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {novels.map(novel => (
                      <NovelCard key={novel._id || novel.id} novel={novel} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Ten autor nie opublikował jeszcze żadnych powieści.
                    </p>
                    <Button as="link" to="/browse">
                      Przeglądaj inne powieści
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default AuthorPage;