import axios from 'axios';

/**
 * Creates an Axios instance for making API requests to the backend.
 * It sets the base URL from environment variables and includes credentials
 * for handling sessions or cookies.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
});

/**
 * Interceptor to automatically add the JWT token to the authorization header
 * for all outgoing requests if a token is found in local storage.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('etherpets-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;