import api from './axios'

export default {
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
}
