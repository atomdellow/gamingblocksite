<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <router-link to="/">Console Gaming Blog</router-link>
      </div>
      <nav class="nav">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          
          <!-- Add Create Post button for logged-in users -->
          <li v-if="authStore.isLoggedIn" class="create-post-item">
            <router-link to="/create-post" class="create-post-btn">
              <span class="plus-icon">+</span> Create Post
            </router-link>
          </li>
          
          <li v-if="authStore.isLoggedIn && authStore.isAdmin">
            <router-link to="/admin">Admin</router-link>
          </li>
          
          <li v-if="!authStore.isLoggedIn">
            <router-link to="/login">Login</router-link>
          </li>
          
          <li v-if="!authStore.isLoggedIn">
            <router-link to="/register">Register</router-link>
          </li>
          
          <li v-if="authStore.isLoggedIn">
            <router-link to="/profile">Profile</router-link>
          </li>
          
          <li v-if="authStore.isLoggedIn">
            <button @click="logout" class="logout-btn">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  background-color: #1a1a2e;
  color: white;
  padding: 1rem 0;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo a {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav a:hover, 
.nav a.router-link-active {
  color: #e94560;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

.logout-btn:hover {
  color: #e94560;
}

/* New styles for Create Post button */
.create-post-btn {
  background-color: #e94560;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.3s;
}

.create-post-btn:hover {
  background-color: #d13355;
  color: white; /* Override the default hover color */
}

.plus-icon {
  font-weight: bold;
  font-size: 1.2rem;
}

/* For mobile responsiveness */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .logo {
    margin-bottom: 1rem;
  }
  
  .nav ul {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem 1.5rem;
  }
}
</style>
