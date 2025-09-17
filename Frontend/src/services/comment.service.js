import api from './api';

const CommentService = {
  // Get comments for a novel
  getComments: async (novelId, params = {}) => {
    try {
      // Add recursive parameter to get nested replies for all comments
      const requestParams = { ...params, recursive: true, populate: 'replies', depth: 10 };
      const response = await api.get(`/comments/novel/${novelId}`, { params: requestParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific comment by ID with its replies
  getComment: async (commentId) => {
    try {
      const response = await api.get(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get replies for a comment
  getReplies: async (commentId, params = {}) => {
    try {
      // Add recursive parameter to get nested replies
      const requestParams = { ...params, recursive: true, depth: 10 };
      const response = await api.get(`/comments/${commentId}/replies`, { params: requestParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new comment or reply
  createComment: async (commentData) => {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId, content) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default CommentService;