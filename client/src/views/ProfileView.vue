<template>
  <div class="profile">
    <h1>User Profile</h1>
    
    <div class="profile-container" v-if="user">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="avatarUrl" :alt="user.username">
        </div>
        <div class="profile-info">
          <h2>{{ user.username }}</h2>
          <p>{{ user.email }}</p>
          <p>Role: {{ user.role }}</p>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn edit-btn">Edit Profile</button>
      </div>
    </div>
    
    <div v-else class="loading">
      Loading profile...
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const avatarUrl = computed(() => {
  // If user has no avatar or if it's just loading, return a default avatar
  if (!user.value || !user.value.avatar) {
    return 'https://via.placeholder.com/150?text=User'
  }
  
  // If avatar URL starts with http, it's an external URL
  if (user.value.avatar.startsWith('http')) {
    return user.value.avatar
  }
  
  // Otherwise it's a relative path on the server
  return `http://localhost:5000/${user.value.avatar}`
})
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}

.profile-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-avatar {
  margin-right: 2rem;
}

.profile-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0 0 0.5rem;
  color: #0f3460;
}

.profile-info p {
  margin: 0.25rem 0;
  color: #666;
}

.profile-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
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

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>
