import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import { FaReply, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import Button from '../common/Button';
import CommentForm from './CommentForm';
import CommentService from '../../services/comment.service';

const Comment = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  isReplying,
  isEditing,
  parentId,
  toggleReply,
  toggleEdit
}) => {
  const { currentUser } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  const isAuthor = currentUser && comment.author && comment.author._id === currentUser.id;
  const formattedDate = formatDate(comment.createdAt);
  const isDeleted = comment.isDeleted;

  if (isDeleted) {
    return null;
  }

  useEffect(() => {
    if (comment.replies && comment.replies.length > 0 && !repliesLoaded) {
      const filteredReplies = comment.replies.filter(reply => !reply.isDeleted);
      setReplies(filteredReplies);
      setRepliesLoaded(true);
    }
  }, [comment.replies, repliesLoaded]);

  useEffect(() => {
    const fetchReplies = async () => {
      if (showReplies && !repliesLoaded && comment._id) {
        try {
          setLoadingReplies(true);
          const response = await CommentService.getReplies(comment._id);

          if (response.status === 'success') {
            const repliesData = response.data.data || [];
            const processReplies = (replyItems) => {
              return replyItems
                .filter(reply => !reply.isDeleted)
                .map(reply => {
                  if (reply.replies && reply.replies.length > 0) {
                    return {
                      ...reply,
                      replies: processReplies(reply.replies)
                    };
                  }
                  return reply;
                });
            };
            const processedReplies = processReplies(repliesData);
            setReplies(processedReplies);
            setRepliesLoaded(true);
          }
        } catch (err) {
          console.error('Failed to load replies:', err);
        } finally {
          setLoadingReplies(false);
        }
      }
    };
    fetchReplies();
  }, [showReplies, repliesLoaded, comment._id]);

  const handleToggleReplies = () => {
    setShowReplies(prevState => !prevState);
  };

  const handleReplySubmit = async (content) => {
    const newReply = await onReply(content, comment._id);
    const structuredReply = {
      ...newReply,
      replies: []
    };
    if (!repliesLoaded) {
      setRepliesLoaded(true);
    }
    setReplies(prevReplies => [structuredReply, ...prevReplies]);
    setShowReplies(true);
    return structuredReply;
  };

  const handleEditSubmit = (updatedContent) => {
    onEdit(comment._id, updatedContent);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
      onDelete(comment._id, parentId);
    }
  };

  const handleNestedDeleteComment = (deletedCommentId, deletedParentId) => {
    // Remove from local replies state if it's a direct child
    setReplies(prevReplies => prevReplies.filter(reply => reply._id !== deletedCommentId));
    
    // Also call the parent's delete handler
    onDelete(deletedCommentId, deletedParentId);
  };

  const isReply = !!parentId;
  const actualReplyCount = comment.replyCount > 0 ? comment.replyCount : replies.length;

  return (
    <div className={`mb-6 ${isReply ? 'ml-6 border-l-2 border-indigo-200 dark:border-indigo-700/50 pl-4' : ''}`}>
      <div className="bg-white dark:bg-gray-800">
        <div className="flex items-start mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-md font-semibold mr-3 flex-shrink-0">
            {comment.author ? comment.author.username.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-x-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {comment.author ? comment.author.username : 'Anonim'}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formattedDate}
              </p>
            </div>
            {isEditing === comment._id ? (
              <CommentForm
                initialValue={comment.content}
                onSubmit={handleEditSubmit}
                onCancel={() => toggleEdit(null)}
                isEdit={true}
              />
            ) : (
              <div className="text-gray-700 dark:text-gray-300 text-sm mt-2 whitespace-pre-line break-words">
                {comment.content}
              </div>
            )}
          </div>
        </div>

        {isEditing !== comment._id && (
          <div className="flex items-center ml-13 mt-3 space-x-4">
            {currentUser && (
              <button
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors duration-200"
                onClick={() => toggleReply(comment._id)}
              >
                <FaReply className="mr-1 text-sm" />
                Odpowiedz
              </button>
            )}

            {isAuthor && (
              <>
                <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors duration-200"
                  onClick={() => toggleEdit(comment._id)}
                >
                  <FaEdit className="mr-1 text-sm" />
                  Edytuj
                </button>
                <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center transition-colors duration-200"
                  onClick={handleDeleteClick}
                >
                  <FaTrash className="mr-1 text-sm" />
                  Usuń
                </button>
              </>
            )}

            {actualReplyCount > 0 && (
              <>
                <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors duration-200"
                  onClick={handleToggleReplies}
                >
                  {showReplies ? 'Ukryj odpowiedzi' : `Pokaż odpowiedzi (${actualReplyCount})`}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isReplying === comment._id && (
        <div className="ml-13 mt-4">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => toggleReply(null)}
            placeholder="Napisz odpowiedź..."
          />
        </div>
      )}

      {showReplies && (
        <div className="ml-6 mt-4">
          {loadingReplies ? (
            <div className="flex justify-center py-4">
              <FaSpinner className="animate-spin text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
          ) : replies.length > 0 ? (
            <div className="space-y-6">
              {replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={handleNestedDeleteComment}
                  isReplying={isReplying}
                  isEditing={isEditing}
                  parentId={comment._id}
                  toggleReply={toggleReply}
                  toggleEdit={toggleEdit}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-2 ml-4">
              Brak odpowiedzi.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;