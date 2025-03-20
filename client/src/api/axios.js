import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
  ? 'https://gbs-staging-3474ded0ac56.herokuapp.com/api'
  : 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Making request to:', config.url)
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear local storage on unauthorized
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api