import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor for responses to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - Clear local auth state and redirect if needed
        // This is handled by AuthContext as well
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
      
      if (status === 403) {
        // Forbidden
        console.error('Access denied');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
