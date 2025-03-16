<template>
  <div class="category-view">
    <div v-if="loading" class="loading">
      Loading category...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <template v-else-if="category">
      <div class="category-header">
        <h1>{{ category.name }}</h1>
        <p v-if="category.description" class="category-description">{{ category.description }}</p>
      </div>
      
      <div class="posts-section">
        <h2>Posts in {{ category.name }}</h2>
        
        <PostList
          :posts="posts"
          :loading="loadingPosts"
          :error="postsError"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @paginate="handlePagination"
        />
        
        <div v-if="!loadingPosts && posts.length === 0" class="no-posts">
          <p>No posts found in this category.</p>
        </div>
      </div>
    </template>
    
    <div v-else class="error">
      Category not found
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoriesStore } from '../stores/categories'
import PostList from '../components/posts/PostList.vue'
import categoriesApi from '../api/categories'
import postsApi from '../api/posts'

const route = useRoute()
const categoriesStore = useCategoriesStore()

const category = ref(null)
const posts = ref([])
const loading = ref(true)
const loadingPosts = ref(true)
const error = ref('')
const postsError = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

const categorySlug = computed(() => route.params.slug)

const fetchCategory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // First check if the category is already in the store
    const foundCategory = categoriesStore.getCategoryBySlug(categorySlug.value)
    
    if (foundCategory) {
      category.value = foundCategory
    } else {
      // Otherwise, fetch all categories and find the one with matching slug
      await categoriesStore.fetchCategories()
      category.value = categoriesStore.getCategoryBySlug(categorySlug.value)
      
      if (!category.value) {
        error.value = 'Category not found'
      }
    }
  } catch (err) {
    error.value = 'Failed to load category'
  } finally {
    loading.value = false
  }
}

const fetchPosts = async (page = 1) => {
  if (!category.value) return
  
  loadingPosts.value = true
  postsError.value = ''
  currentPage.value = page
  
  try {
    const response = await postsApi.getPosts({
      category: category.value._id,
      page
    })
    
    posts.value = response.data
    totalPages.value = response.totalPages
  } catch (err) {
    postsError.value = 'Failed to load posts'
  } finally {
    loadingPosts.value = false
  }
}

const handlePagination = (page) => {
  fetchPosts(page)
  // Scroll to top of posts section
  document.querySelector('.posts-section').scrollIntoView({ behavior: 'smooth' })
}

// Watch for route changes to handle navigation between categories
watch(() => route.params.slug, () => {
  fetchCategory()
  fetchPosts(1)
})

onMounted(async () => {
  await fetchCategory()
  if (category.value) {
    fetchPosts(1)
  }
})
</script>

<style scoped>
.category-view {
  max-width: 1000px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
}

.error {
  color: #e94560;
}

.category-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.category-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.category-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.posts-section {
  margin-top: 2rem;
}

.posts-section h2 {
  margin-bottom: 1.5rem;
}

.no-posts {
  padding: 3rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>
