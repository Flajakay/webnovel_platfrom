import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CommentService from '../../services/comment.service';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { FaSpinner, FaComments } from 'react-icons/fa';
import Button from '../common/Button';

const CommentSection = ({ novelId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReplying, setIsReplying] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Fetch comments with recursive processing of nested replies
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await CommentService.getComments(novelId, { page, limit: 10 });
        
        if (response.status === 'success') {
          const commentData = response.data.data || [];
          const pagination = response.data.pagination || {};
          
          // Process comments to ensure nested replies are properly structured
          // AND filter out deleted comments completely
          const processComments = (comments) => {
            return comments
              .filter(comment => !comment.isDeleted) // Remove deleted comments completely
              .map(comment => {
                // Ensure the comment has a replies array if it doesn't already
                const processedComment = {
                  ...comment,
                  replies: comment.replies || []
                };
                
                // If the comment has replies, process them recursively
                if (processedComment.replies && processedComment.replies.length > 0) {
                  processedComment.replies = processComments(processedComment.replies);
                }
                
                return processedComment;
              });
          };
          
          const processedComments = processComments(commentData);
          
          if (page === 1) {
            setComments(processedComments);
          } else {
            setComments(prevComments => [...prevComments, ...processedComments]);
          }
          
          // Check if there are more pages
          setHasMore(pagination.page < pagination.pages);
        } else {
          setError('Failed to load comments');
        }
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [novelId, page]);
  
  // Load more comments
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  // Toggle reply form
  const toggleReply = (commentId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/novels/${novelId}` } });
      return;
    }
    
    setIsReplying(isReplying === commentId ? null : commentId);
    setIsEditing(null);
  };
  
  // Toggle edit form
  const toggleEdit = (commentId) => {
    setIsEditing(isEditing === commentId ? null : commentId);
    setIsReplying(null);
  };
  
  // Handle creating a top-level comment
  const handleCreateComment = async (content) => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/novels/${novelId}` } });
      return;
    }
    
    try {
      const response = await CommentService.createComment({
        content,
        novelId
      });
      
      if (response.status === 'success') {
        const newComment = response.data;
        setComments(prevComments => [newComment, ...prevComments]);
        return newComment;
      }
    } catch (err) {
      console.error('Failed to create comment:', err);
      throw err;
    }
  };
  
  // Handle creating a reply with proper nesting support
  const handleReply = async (content, parentId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/novels/${novelId}` } });
      return;
    }
    
    try {
      const response = await CommentService.createComment({
        content,
        novelId,
        parentId
      });
      
      if (response.status === 'success') {
        const newReply = response.data;
        setIsReplying(null);
        
        // Only update direct children of top-level comments
        // Nested replies are handled by the Comment component itself
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replyCount: (comment.replyCount || 0) + 1
              };
            }
            return comment;
          })
        );
        
        return newReply;
      }
    } catch (err) {
      console.error('Failed to create reply:', err);
      throw err;
    }
  };
  
  // Handle editing a comment
  const handleEditComment = async (commentId, content) => {
    try {
      const response = await CommentService.updateComment(commentId, content);
      
      if (response.status === 'success') {
        const updatedComment = response.data;
        
        setComments(prevComments => 
          prevComments.map(comment => 
            comment._id === commentId 
              ? { ...comment, content: updatedComment.content }
              : comment
          )
        );
        
        setIsEditing(null);
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
      throw err;
    }
  };
  
  // Handle deleting a comment with proper handling for nested replies
  const handleDeleteComment = async (commentId, parentId) => {
    try {
      const response = await CommentService.deleteComment(commentId);
      
      if (response.status === 'success') {
        // Helper function to recursively remove comment from nested structure
        const removeCommentFromList = (commentsList, targetId) => {
          return commentsList
            .filter(comment => comment._id !== targetId)
            .map(comment => ({
              ...comment,
              replies: comment.replies ? removeCommentFromList(comment.replies, targetId) : []
            }));
        };
        
        // If this is a top-level comment
        if (!parentId) {
          setComments(prevComments => 
            prevComments.filter(comment => comment._id !== commentId)
          );
        } else {
          // This is a nested reply - remove it from the nested structure
          setComments(prevComments => removeCommentFromList(prevComments, commentId));
        }
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <FaComments className="mr-2 text-indigo-500" />
          Dyskusja
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {comments.length} {comments.length === 1 ? 'komentarz' : 'komentarzy'}
        </span>
      </div>
      
      {currentUser ? (
        <div className="mb-6">
          <CommentForm onSubmit={handleCreateComment} />
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg mb-4 text-center">
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            Zaloguj się, aby dołączyć do dyskusji
          </p>
          <Button 
            as="link" 
            to="/login" 
            state={{ from: `/novels/${novelId}` }}
            size="sm"
          >
            Sign In
          </Button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-6">
          <FaSpinner className="animate-spin text-indigo-600 dark:text-indigo-400 text-xl" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm">Jeszcze nikt nie skomentował. Bądź pierwszy!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              isReplying={isReplying}
              isEditing={isEditing}
              toggleReply={toggleReply}
              toggleEdit={toggleEdit}
            />
          ))}
          
          {hasMore && (
            <div className="pt-2">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={loading}
                size="sm"
                className="w-full justify-center"
              >
                {loading && page > 1 ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Ładowanie...
                  </>
                ) : (
                  'Załaduj więcej komentarzy'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;