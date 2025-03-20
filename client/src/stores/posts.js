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

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    post: null,
    loading: false,
    error: null,
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1
  }),
  
  getters: {
    getPostById: (state) => (id) => {
      return state.posts.find(post => post._id === id)
    }
  },
  
  actions: {
    async fetchPosts(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const queryParams = new URLSearchParams()
        
        // Add pagination params
        if (params.page) queryParams.append('page', params.page)
        if (params.limit) queryParams.append('limit', params.limit)
        
        // Add filtering params
        if (params.category) queryParams.append('category', params.category)
        if (params.tag) queryParams.append('tag', params.tag)
        if (params.search) queryParams.append('search', params.search)
        
        const response = await api.get(`/posts?${queryParams.toString()}`)
        
        this.posts = response.data.data
        this.totalPages = response.data.totalPages
        this.currentPage = response.data.currentPage
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch posts'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchPost(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get(`/posts/${id}`)
        this.post = response.data.data
        return this.post
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch post'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async createPost(postData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/posts', postData)
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create post'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updatePost(id, postData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.put(`/posts/${id}`, postData)
        
        // Update the post in the posts array if it exists there
        const index = this.posts.findIndex(p => p._id === id)
        if (index !== -1) {
          this.posts[index] = response.data.data
        }
        
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update post'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deletePost(id) {
      this.loading = true
      this.error = null
      
      try {
        await api.delete(`/posts/${id}`)
        
        // Remove post from local state
        this.posts = this.posts.filter(post => post._id !== id)
        if (this.post && this.post._id === id) {
          this.post = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete post'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async likePost(id) {
      try {
        const response = await api.put(`/posts/${id}/like`)
        
        // Update post in state if it exists
        if (this.post && this.post._id === id) {
          this.post.likes = response.data.data
        }
        
        // Update post in posts array if it exists
        const postIndex = this.posts.findIndex(post => post._id === id)
        if (postIndex !== -1) {
          this.posts[postIndex].likes = response.data.data
        }
        
        return response.data
      } catch (error) {
        console.error('Error liking post:', error)
        throw error
      }
    }
  }
})
