import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api'

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to include the auth token in requests
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
instance.interceptors.response.use(
  response => response.data,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // Optional: Redirect to login page
    }
    return Promise.reject(error)
  }
)

export default instance
