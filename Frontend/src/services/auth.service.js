import api from './api';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.status === 'success' && response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
        
        // Ensure we map _id to id for consistency
        const user = {
          ...response.data.data.user,
          id: response.data.data.user._id || response.data.data.user.id
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Optional: Call the logout endpoint if the backend requires it
    try {
      api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Fetch current user from API
  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.status === 'success' && response.data.data) {
        // Ensure we map _id to id for consistency
        const user = {
          ...response.data.data,
          id: response.data.data._id || response.data.data.id
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/reset-password-request', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/me', userData);
      // Update stored user data
      if (response.data.status === 'success' && response.data.data) {
        // Ensure we map _id to id for consistency
        const user = {
          ...response.data.data,
          id: response.data.data._id || response.data.data.id
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      if (response.data.status === 'success' && response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
        if (response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;