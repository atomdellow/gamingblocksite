import axios from 'axios';

const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://gbs-staging-3474ded0ac56.herokuapp.com/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;