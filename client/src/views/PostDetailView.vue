<template>
  <div class="post-detail">
    <div v-if="loading" class="loading">
      Loading post...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <template v-else-if="post">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <div class="post-category">
            <router-link :to="`/category/${post.category.slug}`">
              {{ post.category.name }}
            </router-link>
          </div>
          
          <div class="post-author">
            By {{ post.author.username }}
          </div>
          
          <div class="post-date">
            {{ formatDate(post.createdAt) }}
          </div>
        </div>
        <div class="post-actions" v-if="isAuthor || isAdmin">
          <router-link :to="`/edit-post/${post._id}`" class="btn edit-btn">Edit</router-link>
          <button @click="confirmDelete" class="btn delete-btn">Delete</button>
        </div>
      </div>
      
      <div class="featured-image" v-if="post.featuredImage">
        <img :src="getImageUrl(post.featuredImage)" :alt="post.title">
      </div>
      
      <!-- Fixed v-html error by removing child elements -->
      <div class="post-content" v-html="post.content"></div>
      
      <div class="post-tags" v-if="post.tags && post.tags.length > 0">
        <div class="tags-title">Tags:</div>
        <div class="tags-list">
          <router-link
            v-for="tag in post.tags"
            :key="tag"
            :to="`/tag/${tag}`"
            class="tag"
          >
            {{ tag }}
          </router-link>
        </div>
      </div>
      
      <div class="post-footer">
        <button @click="likePost" class="like-button" :class="{ liked: isLiked }">
          <span class="like-icon">♥</span>
          <span>{{ post.likes ? post.likes.length : 0 }} {{ isLiked ? 'Liked' : 'Like' }}</span>
        </button>
      </div>
      
      <div class="comments-section">
        <h2>Comments ({{ post.comments ? post.comments.length : 0 }})</h2>
        <!-- Comment form and list would go here -->
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'PostDetailView',
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const postsStore = usePostsStore()
    const authStore = useAuthStore()

    const post = ref(null)
    const loading = ref(true)
    const error = ref('')
    const postId = computed(() => route.params.id)

    const isAuthor = computed(() => {
      return post.value && authStore.user && post.value.author._id === authStore.user.id
    })

    const isAdmin = computed(() => authStore.isAdmin)
    const isLoggedIn = computed(() => authStore.isLoggedIn)

    const isLiked = computed(() => {
      if (!post.value?.likes || !authStore.user?.id) return false
      return post.value.likes.includes(authStore.user.id)
    })

    const getImageUrl = (image) => {
      if (image && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:'))) {
        return image
      }
      return image ? `/uploads/${image}` : '/images/default-post.jpg'
    }

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const fetchPost = async () => {
      loading.value = true
      error.value = ''
      
      try {
        post.value = await postsStore.fetchPost(postId.value)
      } catch (err) {
        error.value = 'Failed to load post. It might have been deleted or may not exist.'
      } finally {
        loading.value = false
      }
    }

    const likePost = async () => {
      if (!isLoggedIn.value) {
        router.push({ name: 'login', query: { redirect: route.fullPath } })
        return
      }
      
      try {
        await postsStore.likePost(postId.value)
      } catch (err) {
        error.value = 'Failed to like post'
      }
    }

    const confirmDelete = () => {
      if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        deletePost()
      }
    }

    const deletePost = async () => {
      try {
        await postsStore.deletePost(postId.value)
        router.push('/')
      } catch (err) {
        error.value = 'Failed to delete post'
      }
    }

    onMounted(() => {
      fetchPost()
    })

    return {
      post,
      loading,
      error,
      isAuthor,
      isAdmin,
      isLoggedIn,
      isLiked,
      getImageUrl,
      formatDate,
      likePost,
      confirmDelete,
      deletePost
    }
  }
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
}

.error {
  color: #e94560;
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.post-category a {
  color: #0f3460;
  font-weight: 600;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.post-actions .btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
}

.edit-btn {
  background-color: #e3f2fd;
  color: #1976d2;
  border: none;
}

.delete-btn {
  background-color: #ffebee;
  color: #c62828;
  border: none;
}

.featured-image {
  margin-bottom: 2rem;
}

.featured-image img {
  width: 100%;
  border-radius: 8px;
  max-height: 500px;
  object-fit: cover;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.post-tags {
  margin-top: 3rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tags-title {
  margin-right: 1rem;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #f5f5f5;
  color: #333;
  padding: 0.3rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
  text-decoration: none;
}

.tag:hover {
  background-color: #e0e0e0;
}

.post-footer {
  margin-top: 3rem;
  margin-bottom: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.like-button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.like-icon {
  color: #999;
  font-size: 1.2rem;
}

.like-button.liked .like-icon {
  color: #e94560;
}

.comments-section {
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.comments-section h2 {
  margin-bottom: 1.5rem;
}
</style>