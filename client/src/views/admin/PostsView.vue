<template>
  <div class="admin-posts">
    <div class="page-header">
      <h1>Manage Posts</h1>
      <router-link to="/create-post" class="create-button">
        Create New Post
      </router-link>
    </div>
    
    <div class="filters">
      <div class="filter-group">
        <input 
          type="text" 
          v-model="filters.search" 
          placeholder="Search posts..." 
          @input="applyFilters"
        />
      </div>
      <div class="filter-group">
        <select v-model="filters.category" @change="applyFilters">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <select v-model="filters.status" @change="applyFilters">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      Loading posts...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="table-container">
        <table class="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in paginatedPosts" :key="post._id">
              <td>
                <router-link :to="`/posts/${post._id}`" class="post-title-link">
                  {{ post.title }}
                </router-link>
              </td>
              <td>{{ getCategoryName(post.category) }}</td>
              <td>{{ post.author.username }}</td>
              <td>
                <span class="status-badge" :class="post.published ? 'published' : 'draft'">
                  {{ post.published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td>{{ formatDate(post.createdAt) }}</td>
              <td class="actions">
                <router-link :to="`/edit-post/${post._id}`" class="action-button edit">
                  Edit
                </router-link>
                <button @click="deletePost(post._id)" class="action-button delete">
                  Delete
                </button>
              </td>
            </tr>
            
            <tr v-if="paginatedPosts.length === 0">
              <td colspan="6" class="no-posts">No posts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            class="page-number"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostsStore } from '../../stores/posts'
import { useCategoriesStore } from '../../stores/categories'

const postsStore = usePostsStore()
const categoriesStore = useCategoriesStore()

const posts = ref([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = ref(1)

const filters = ref({
  search: '',
  category: '',
  status: ''
})

// Filter posts based on search, category, and status
const filteredPosts = computed(() => {
  if (!posts.value.length) return []
  
  return posts.value.filter(post => {
    // Search filter
    const searchMatch = !filters.value.search || 
      post.title.toLowerCase().includes(filters.value.search.toLowerCase())
    
    // Category filter
    const categoryMatch = !filters.value.category || 
      post.category._id === filters.value.category
    
    // Status filter
    const statusMatch = !filters.value.status || 
      (filters.value.status === 'published' && post.published) ||
      (filters.value.status === 'draft' && !post.published)
    
    return searchMatch && categoryMatch && statusMatch
  })
})

// Get paginated posts for current page
const paginatedPosts = computed(() => {
  const filtered = filteredPosts.value
  
  // Calculate total pages
  totalPages.value = Math.ceil(filtered.length / itemsPerPage)
  if (totalPages.value === 0) totalPages.value = 1
  
  // Ensure current page is within bounds
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  return filtered.slice(startIndex, endIndex)
})

const getCategoryName = (categoryId) => {
  const category = categoriesStore.getCategoryById(categoryId)
  return category?.name || 'Uncategorized'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const applyFilters = () => {
  // Reset to first page when filters change
  currentPage.value = 1
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const deletePost = async (postId) => {
  if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    try {
      await postsStore.deletePost(postId)
      
      // Remove post from local state
      posts.value = posts.value.filter(p => p._id !== postId)
      
      // If the current page becomes empty after deleting and it's not the first page,
      // go back to the previous page
      if (paginatedPosts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } catch (err) {
      error.value = 'Failed to delete post'
      console.error('Error deleting post:', err)
    }
  }
}

const fetchPosts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, you might want to fetch all posts for admin
    // with a special endpoint that returns all posts, published or not
    const response = await postsStore.fetchPosts({ limit: 1000 }) // Fetch all posts for admin
    posts.value = response.data || []
  } catch (err) {
    error.value = 'Failed to load posts'
    console.error('Error fetching posts:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    // Load categories if not already loaded
    if (categoriesStore.categories.length === 0) {
      await categoriesStore.fetchCategories()
    }
    
    await fetchPosts()
  } catch (err) {
    error.value = 'Error initializing page'
  }
})
</script>

<style scoped>
.admin-posts {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-button {
  background-color: #0f3460;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #0a2748;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  flex: 1;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
}

.error {
  color: #e94560;
}

.table-container {
  overflow-x: auto;
}

.posts-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.posts-table th,
.posts-table td {
  padding: 1rem;
  text-align: left;
}

.posts-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.posts-table tr {
  border-bottom: 1px solid #eee;
}

.posts-table tr:last-child {
  border-bottom: none;
}

.post-title-link {
  color: #0f3460;
  text-decoration: none;
  font-weight: 500;
}

.post-title-link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.published {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.draft {
  background-color: #fff8e1;
  color: #ff8f00;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: none;
}

.action-button.edit {
  background-color: #e3f2fd;
  color: #1976d2;
}

.action-button.delete {
  background-color: #ffebee;
  color: #c62828;
}

.action-button.edit:hover {
  background-color: #bbdefb;
}

.action-button.delete:hover {
  background-color: #ffcdd2;
}

.no-posts {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.page-number.active {
  background-color: #0f3460;
  color: white;
  border-color: #0f3460;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
