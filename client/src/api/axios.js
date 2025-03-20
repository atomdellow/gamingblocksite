import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
  ? 'https://gbs-staging-3474ded0ac56.herokuapp.com/api'
  : 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('API Request to:', config.url)
  return config
})

export default api