import { defineStore } from 'pinia'
import api from '../api/axios'

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
  getPosts(params = {}) {
    return api.get('/posts', { params })
  },
  
  getPost(id) {
    return api.get(`/posts/${id}`)
  },
  
  createPost(postData) {
    return api.post('/posts', postData)
  },
  
  updatePost(id, postData) {
    return api.put(`/posts/${id}`, postData)
  },
  
  deletePost(id) {
    return api.delete(`/posts/${id}`)
  },
  
  likePost(id) {
    return api.put(`/posts/${id}/like`)
  }
});
