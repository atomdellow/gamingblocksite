import { defineStore } from 'pinia'
import api from '../api/axios'

// Remove duplicate interceptor since it's already in axios.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        console.log('Registration attempt for:', userData.email)
        const response = await api.post('/auth/register', userData)
        
        if (!response.data?.token || !response.data?.user) {
          throw new Error('Invalid registration response format')
        }
        
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message)
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        console.log('Login attempt for:', credentials.email)
        const response = await api.post('/auth/login', credentials)
        console.log('Login response received')

        if (!response.data?.token || !response.data?.user) {
          throw new Error('Invalid login response format')
        }

        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      } catch (error) {
        console.error('Login error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        })
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadUser() {
      if (!this.token) {
        console.log('No token found, skipping user load')
        return
      }

      this.loading = true
      try {
        const response = await api.get('/auth/me')
        
        if (!response.data?.data) {
          throw new Error('Invalid user data format')
        }

        this.user = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
      } catch (error) {
        console.error('Load user error:', error.response?.data || error.message)
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        this.loading = false
      }
    },

    logout() {
      try {
        // Attempt to call logout endpoint
        api.post('/auth/logout').catch(err => 
          console.warn('Logout API call failed:', err.message)
        )
      } finally {
        // Always clear local state
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        console.log('Logged out successfully')
      }
    }
  }
})