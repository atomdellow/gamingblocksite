import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://gbs-staging-3474ded0ac56.herokuapp.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;