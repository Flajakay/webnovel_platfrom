import api from './api';

const ChapterService = {
  // Get chapters for a novel
  getChapters: async (novelId, params = {}) => {
    try {
      const response = await api.get(`/novels/${novelId}/chapters`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific chapter
  getChapter: async (novelId, chapterNumber) => {
    try {
      const response = await api.get(
        `/novels/${novelId}/chapters/${chapterNumber}`,
        { params: { includeNavigation: true } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new chapter
  createChapter: async (novelId, chapterData) => {
    try {
      const response = await api.post(`/novels/${novelId}/chapters`, chapterData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a chapter
  updateChapter: async (novelId, chapterNumber, chapterData) => {
    try {
      const response = await api.put(
        `/novels/${novelId}/chapters/${chapterNumber}`, 
        chapterData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a chapter
  deleteChapter: async (novelId, chapterNumber) => {
    try {
      const response = await api.delete(`/novels/${novelId}/chapters/${chapterNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ChapterService;