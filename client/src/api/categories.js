import api from './axios'

export default {
  getCategories() {
    return api.get('/categories')
  },
  
  getCategory(id) {
    return api.get(`/categories/${id}`)
  },
  
  createCategory(categoryData) {
    return api.post('/categories', categoryData)
  },
  
  updateCategory(id, categoryData) {
    return api.put(`/categories/${id}`, categoryData)
  },
  
  deleteCategory(id) {
    return api.delete(`/categories/${id}`)
  }
}
