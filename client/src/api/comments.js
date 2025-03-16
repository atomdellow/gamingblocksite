import api from './axios'

export default {
  updateComment(id, commentData) {
    return api.put(`/comments/${id}`, commentData)
  },
  
  deleteComment(id) {
    return api.delete(`/comments/${id}`)
  }
}
