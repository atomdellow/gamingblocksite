<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <div class="actions">
        <router-link to="/" class="home-button">Go to Homepage</router-link>
        <button class="back-button" @click="goBack">Go Back</button>
      </div>
    </div>
    
    <div class="game-reference">
      <h3>While you're here...</h3>
      <p>Why not check out some of our latest posts?</p>
      <div class="featured-posts" v-if="!loading && featuredPosts.length > 0">
        <router-link 
          v-for="post in featuredPosts" 
          :key="post._id" 
          :to="`/posts/${post._id}`"
          class="featured-post"
        >
          {{ post.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import postsApi from '../api/posts'

const router = useRouter()
const featuredPosts = ref([])
const loading = ref(false)

const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await postsApi.getPosts({ limit: 3 })
    featuredPosts.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch featured posts:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.not-found {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  text-align: center;
}

.not-found-content h1 {
  font-size: 6rem;
  color: #e94560;
  margin: 0;
}

.not-found-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.not-found-content p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.home-button,
.back-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.home-button {
  background-color: #0f3460;
  color: white;
  border: none;
}

.back-button {
  background-color: #f5f5f5;
  color: #333;
  border: none;
}

.home-button:hover {
  background-color: #0a2748;
}

.back-button:hover {
  background-color: #e6e6e6;
}

.game-reference {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.game-reference h3 {
  margin-bottom: 0.5rem;
}

.featured-posts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.featured-post {
  display: block;
  padding: 0.75rem;
  text-decoration: none;
  color: #0f3460;
  background-color: white;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.featured-post:hover {
  background-color: #f0f0f0;
}
</style>