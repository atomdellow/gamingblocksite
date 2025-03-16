<template>
  <div class="login">
    <div class="login-container">
      <h1>Login to Your Account</h1>
      
      <div v-if="error" class="alert error">{{ error }}</div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Enter your password"
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn login-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    // Redirect to requested page or home
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #0f3460;
  margin-bottom: 2rem;
}

.alert.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  border-color: #0f3460;
  outline: none;
  box-shadow: 0 0 0 2px rgba(15, 52, 96, 0.2);
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  background-color: #0f3460;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0a2748;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.login-footer a {
  color: #0f3460;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
