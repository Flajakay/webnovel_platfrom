import api from './api';

// Map frontend status to backend status
const mapStatus = (frontendStatus) => {
  const statusMap = {
    'WILL_READ': 'will_read',
    'READING': 'currently_reading',
    'COMPLETED': 'completed',
    'ON_HOLD': 'will_read', // Map ON_HOLD to will_read since backend doesn't have this status
    'DROPPED': 'dropped'
  };
  
  return statusMap[frontendStatus] || frontendStatus;
};

// Map backend status to frontend status
const mapBackendStatus = (backendStatus) => {
  const statusMap = {
    'will_read': 'WILL_READ',
    'currently_reading': 'READING',
    'completed': 'COMPLETED',
    'dropped': 'DROPPED'
  };
  
  return statusMap[backendStatus] || backendStatus;
};

const LibraryService = {
  // Get user's library
  getUserLibrary: async (status = null) => {
    try {
      const params = status ? { status: mapStatus(status) } : {};
      const response = await api.get('/library', { params });
      
      // Transform response to match frontend expectations if needed
      if (response.data.status === 'success' && response.data.data && Array.isArray(response.data.data.data)) {
        response.data.data = response.data.data.data.map(item => ({
          ...item,
          status: mapBackendStatus(item.status) // Map status to frontend format
        }));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add novel to library
  addToLibrary: async (novelId, status = 'WILL_READ') => {
    try {
      const response = await api.post(`/library/${novelId}`, { 
        status: mapStatus(status)
      });
      
      // Transform response to match frontend expectations
      if (response.data.status === 'success' && response.data.data) {
        response.data.data.status = mapBackendStatus(response.data.data.status);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update novel status in library
  updateStatus: async (novelId, status) => {
    try {
      const response = await api.patch(`/library/${novelId}/status`, { 
        status: mapStatus(status)
      });
      
      // Transform response to match frontend expectations
      if (response.data.status === 'success' && response.data.data) {
        response.data.data.status = mapBackendStatus(response.data.data.status);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update last read chapter
  updateLastReadChapter: async (novelId, chapterNumber) => {
    try {
      const response = await api.patch(`/library/${novelId}/last-read`, { 
        chapterNumber 
      });
      
      // Transform response to match frontend expectations
      if (response.data.status === 'success' && response.data.data) {
        response.data.data.status = mapBackendStatus(response.data.data.status);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check if novel is in library
  checkInLibrary: async (novelId) => {
    try {
      const response = await api.get(`/library/${novelId}/check`);
      
      // Transform response to match frontend expectations
      if (response.data.status === 'success' && response.data.data) {
        response.data.data.status = mapBackendStatus(response.data.data.status);
      }
      
      return response;
    } catch (error) {
      // If 404, novel is not in library
      if (error.response && error.response.status === 404) {
        return { data: { status: 'success', data: { inLibrary: false } } };
      }
      throw error;
    }
  },

  // Remove novel from library
  removeFromLibrary: async (novelId) => {
    try {
      const response = await api.delete(`/library/${novelId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default LibraryService;