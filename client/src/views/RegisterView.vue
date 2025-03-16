<template>
  <div class="register">
    <div class="register-container">
      <h1>Create an Account</h1>
      
      <div v-if="error" class="alert error">{{ error }}</div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            placeholder="Choose a username"
          />
        </div>
        
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
            placeholder="Choose a password"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            placeholder="Confirm your password"
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn register-btn" :disabled="loading || !isFormValid">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </form>
      
      <div class="register-footer">
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const isFormValid = computed(() => {
  return (
    username.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value
  )
})

const handleRegister = async () => {
  if (loading.value) return
  if (!isFormValid.value) {
    error.value = 'Please check your input'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 0;
}

.register-container {
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

.register-btn {
  width: 100%;
}

.register-footer {
  margin-top: 2rem;
  text-align: center;
}

.register-footer a {
  color: #0f3460;
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
