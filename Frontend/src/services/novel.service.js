import api from './api';

const NovelService = {
  // Get all novels with filters/search
  getNovels: async (params = {}) => {
    try {
      // If authorId is provided, redirect to the specific author endpoint
      if (params.authorId) {
        return await NovelService.getNovelsByAuthor(params.authorId, {
          page: params.page,
          limit: params.limit,
          status: params.status
        });
      }
      
      // Map front-end friendly params to API expected params
      const apiParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.q || '',  // Map 'q' to 'search'
        genres: params.genre ? [params.genre] : undefined,  // Convert single genre to array
        status: params.status,  // Status parameter
        sortBy: mapSortField(params.sort),  // Convert sort field
        order: params.order,  // Add the missing order parameter
        mode: 'default'
      };
      
      // Clean undefined parameters
      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === undefined) {
          delete apiParams[key];
        }
      });
      
      const response = await api.get('/novels', { params: apiParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get novel by ID
  getNovelById: async (id) => {
    try {
      const response = await api.get(`/novels/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get novel cover image URL
  getNovelCoverUrl: (id) => {
    return `${api.defaults.baseURL}/novels/${id}/cover`;
  },

  // Create a new novel
  createNovel: async (novelData, coverFile) => {
    try {
      const formData = new FormData();
      
      // Add novel data
      formData.append('title', novelData.title);
      formData.append('description', novelData.description);
      
      // Handle genres array
      if (novelData.genres && Array.isArray(novelData.genres)) {
        novelData.genres.forEach((genre, index) => {
          formData.append(`genres[${index}]`, genre);
        });
      }
      
      // Handle tags array
      if (novelData.tags && Array.isArray(novelData.tags)) {
        novelData.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Add status
      formData.append('status', novelData.status);
      
      // Add cover if provided
      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      const response = await api.post('/novels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update novel
  updateNovel: async (id, novelData, coverFile) => {
    try {
      const formData = new FormData();
      
      // Add novel data if provided
      if (novelData.title) formData.append('title', novelData.title);
      if (novelData.description) formData.append('description', novelData.description);
      
      // Handle genres array
      if (novelData.genres && Array.isArray(novelData.genres)) {
        novelData.genres.forEach((genre, index) => {
          formData.append(`genres[${index}]`, genre);
        });
      }
      
      // Handle tags array
      if (novelData.tags && Array.isArray(novelData.tags)) {
        novelData.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Add status if provided
      if (novelData.status) formData.append('status', novelData.status);
      
      // Add cover if provided
      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      const response = await api.put(`/novels/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete novel
  deleteNovel: async (id) => {
    try {
      const response = await api.delete(`/novels/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rate a novel
  rateNovel: async (id, rating) => {
    try {
      const response = await api.post(`/novels/${id}/ratings`, { rating });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Increment novel view count
  incrementViewCount: async (id) => {
    try {
      const response = await api.post(`/novels/${id}/increment-view`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get novels by author
  getNovelsByAuthor: async (authorId, params = {}) => {
    try {
      const response = await api.get(`/novels/author/${authorId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user's novels
  getMyNovels: async (params = {}) => {
    try {
      const response = await api.get('/novels/me', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Import chapters from EPUB
  importChaptersFromEpub: async (novelId, epubFile, options = {}) => {
    try {
      const formData = new FormData();
      
      // Add the EPUB file
      formData.append('epub', epubFile);
      
      // Add options
      if (options.overwrite !== undefined) {
        formData.append('overwrite', options.overwrite);
      }
      
      if (options.draft !== undefined) {
        formData.append('draft', options.draft);
      }
      
      const response = await api.post(`/novels/${novelId}/import-chapters`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get author analytics
  getAuthorAnalytics: async (authorId, period) => {
    try {
      const response = await api.get(`/novels/author/${authorId}/analytics`, { 
        params: period ? { period } : {} 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to map frontend sort fields to API sort fields
function mapSortField(sortField) {
  const sortMapping = {
    'createdAt': 'recent',
    'updatedAt': 'recent',
    'viewCount': 'views',
    'calculatedStats.averageRating': 'rating',
    'totalChapters': 'chapters'
  };
  
  return sortField ? (sortMapping[sortField] || 'relevance') : 'relevance';
}

export default NovelService;