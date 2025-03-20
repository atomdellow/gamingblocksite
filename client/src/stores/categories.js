import { defineStore } from 'pinia'
import api from '../services/api'

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    category: null,
    loading: false,
    error: null
  }),

  getters: {
    getCategoryById: (state) => (id) => {
      return state.categories.find(category => category._id === id)
    },
    getCategoryBySlug: (state) => (slug) => {
      return state.categories.find(category => category.slug === slug)
    }
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching categories from API...')
        const response = await api.get('/categories')
        console.log('Categories API response:', response)
        
        if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data
        } else if (response && response.data && Array.isArray(response.data.data)) {
          this.categories = response.data.data
        } else {
          console.error('Invalid categories data format:', response)
          this.categories = []
        }
        
        console.log('Categories stored in state:', this.categories)
        return this.categories
      } catch (error) {
        console.error('Error in fetchCategories action:', error)
        this.error = error.response?.data?.error || 'Failed to fetch categories'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategory(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/categories/${id}`)
        
        // Add or update category in the categories array
        const index = this.categories.findIndex(c => c._id === id)
        if (index !== -1) {
          this.categories[index] = response.data.data
        } else {
          this.categories.push(response.data.data)
        }
        
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch category'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCategory(categoryData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/categories', categoryData)
        this.categories.push(response.data.data)
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create category'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id, categoryData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/categories/${id}`, categoryData)
        
        // Update category in state
        const index = this.categories.findIndex(c => c._id === id)
        if (index !== -1) {
          this.categories[index] = response.data.data
        }
        
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update category'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/categories/${id}`)
        
        // Remove category from state
        this.categories = this.categories.filter(category => category._id !== id)
        
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete category'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
