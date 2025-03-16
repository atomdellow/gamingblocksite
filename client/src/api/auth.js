import api from './axios'

export default {
  register(userData) {
    return api.post('/auth/register', userData)
  },
  
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  
  getMe() {
    return api.get('/auth/me')
  },
  
  logout() {
    return api.get('/auth/logout')
  }
}
