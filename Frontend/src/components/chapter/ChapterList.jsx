import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../common/Button';
import ChapterService from '../../services/chapter.service';
import { formatDate } from '../../utils/helpers';

const ChapterList = ({ chapters, novelId, currentChapter, isAuthor = false, onChapterDelete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteChapter = async (event, chapterNumber) => {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm(`Czy na pewno chcesz usunąć Rozdział ${chapterNumber}? Tej operacji nie można cofnąć.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await ChapterService.deleteChapter(novelId, chapterNumber);

      if (response.status === 'success') {
        if (onChapterDelete) {
          onChapterDelete(chapterNumber);
        }
      } else {
        setError('Nie udało się usunąć rozdziału. Spróbuj ponownie.');
      }
    } catch (err) {
      setError('Nie udało się usunąć rozdziału. Spróbuj ponownie.');
      console.error('Failed to delete chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChapter = (event, chapterNumber) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/novels/${novelId}/chapters/${chapterNumber}/edit`);
  };

  const validChapters = Array.isArray(chapters) ? chapters : [];
  
  // Filter out draft chapters for non-authors
  const visibleChapters = validChapters.filter(chapter => {
    // If user is author, show all chapters
    if (isAuthor) {
      return true;
    }
    // If user is not author, only show published chapters
    return chapter.status === 'published';
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rozdziały</h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {visibleChapters.length > 0 ? (
          visibleChapters.map((chapter) => {
            const chapterId = chapter.id || chapter._id;

            return (
              <Link
                key={chapterId}
                to={`/novels/${novelId}/chapters/${chapter.chapterNumber}`}
                className={`block px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentChapter === chapter.chapterNumber ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start flex-grow">
                    {/* Chapter Number removed completely */}
                    <div className="flex-grow"> {/* No left margin here, as chapter number is gone */}
                      <span className={`font-medium ${
                        currentChapter === chapter.chapterNumber
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {chapter.title}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-3">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{formatDate(chapter.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaEye className="mr-1" />
                          <span>{chapter.readCount || 0} wyświetleń</span>
                        </div>
                        <div className="flex items-center">
                           <span>{chapter.wordCount || 0} słów</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isAuthor && (
                    <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                      chapter.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {chapter.status === 'published' ? 'Opublikowany' : 'Szkic'}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="xs"
                          title="Edytuj Rozdział"
                          onClick={(e) => handleEditChapter(e, chapter.chapterNumber)}
                          disabled={loading}
                        >
                          <FaEdit size={12} />
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          title="Usuń Rozdział"
                          onClick={(e) => handleDeleteChapter(e, chapter.chapterNumber)}
                          disabled={loading}
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              isAuthor ? (
                <>
                  <p className="mb-4">Brak dostępnych rozdziałów.</p>
                  <Button
                    as="link"
                    to={`/novels/${novelId}/chapters/create`}
                    variant="primary"
                    size="sm"
                  >
                    Dodaj swój pierwszy rozdział
                  </Button>
                </>
              ) : (
                <p>Brak dostępnych rozdziałów.</p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterList;