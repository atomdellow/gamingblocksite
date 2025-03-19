import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseURL = isDevelopment 
  ? 'http://localhost:5000/api'
  : `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;