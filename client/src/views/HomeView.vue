<template>
  <div class="home">
    <div class="welcome-section">
      <h1>Welcome to the Console Gaming Blog</h1>
      <p>Your source for console gaming news, reviews, and discussions.</p>
      
      <!-- Add Create Post CTA for logged-in users -->
      <div v-if="isLoggedIn" class="create-post-cta">
        <router-link to="/create-post" class="create-post-button">
          <span>+</span> Create New Post
        </router-link>
      </div>
    </div>
    
    <!-- Post filtering options -->
    <div class="filter-section">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search posts..."
          @input="handleSearch"
        />
      </div>
      <div class="category-filter">
        <select v-model="selectedCategory" @change="handleCategoryChange">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Display posts -->
    <div class="featured-posts">
      <h2>Latest Posts</h2>
      <div v-if="loading" class="loading">Loading posts...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="posts.length === 0" class="no-posts">
        <p>No posts found.</p>
        <div v-if="isLoggedIn" class="no-posts-cta">
          <p>Be the first to create a post!</p>
          <router-link to="/create-post" class="create-post-link">Create Post</router-link>
        </div>
      </div>
      <div v-else class="posts-grid">
        <div v-for="post in posts" :key="post._id" class="post-card">
          <div v-if="post.featuredImage" class="post-image">
            <img :src="getImageUrl(post.featuredImage)" :alt="post.title">
          </div>
          <div class="post-content">
            <h3 class="post-title">
              <router-link :to="`/posts/${post._id}`">{{ post.title }}</router-link>
            </h3>
            <div class="post-meta">
              <span class="post-author">By {{ post.author.username || 'Anonymous' }}</span>
              <span class="post-date">{{ formatDate(post.createdAt) }}</span>
            </div>
            <div class="post-excerpt" v-if="post.content">
              {{ getExcerpt(post.content) }}
            </div>
            <div class="post-footer">
              <router-link :to="`/posts/${post._id}`" class="read-more">Read More</router-link>
              <div class="post-stats">
                <span class="likes">❤ {{ post.likes?.length || 0 }}</span>
                <span class="comments">💬 {{ post.comments?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          class="pagination-button"
        >
          Previous
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in pageNumbers" 
            :key="page" 
            :class="['page-number', { active: page === currentPage }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useCategoriesStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'HomeView',
  
  setup() {
    // Stores
    const postsStore = usePostsStore();
    const categoriesStore = useCategoriesStore();
    const authStore = useAuthStore();
    
    // Reactive state
    const posts = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const searchQuery = ref('');
    const selectedCategory = ref('');
    
    // Computed properties
    const isLoggedIn = computed(() => authStore.isLoggedIn);
    
    const pageNumbers = computed(() => {
      if (totalPages.value <= 7) {
        return Array.from({ length: totalPages.value }, (_, i) => i + 1);
      }
      
      if (currentPage.value <= 3) {
        return [1, 2, 3, 4, 5, '...', totalPages.value];
      }
      
      if (currentPage.value >= totalPages.value - 2) {
        return [1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value];
      }
      
      return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value];
    });
    
    // Methods
    const fetchPosts = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const params = {
          page: currentPage.value,
          limit: 9  // Show 9 posts per page
        };
        
        // Add filters if they exist
        if (searchQuery.value) {
          params.search = searchQuery.value;
        }
        
        if (selectedCategory.value) {
          params.category = selectedCategory.value;
        }
        
        const response = await postsStore.fetchPosts(params);
        posts.value = response.data;
        totalPages.value = response.totalPages;
      } catch (err) {
        error.value = 'Failed to load posts. Please try again later.';
        console.error('Error fetching posts:', err);
      } finally {
        loading.value = false;
      }
    };
    
    const fetchCategories = async () => {
      try {
        await categoriesStore.fetchCategories();
        categories.value = categoriesStore.categories;
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    const changePage = (page) => {
      if (page === '...') return;
      currentPage.value = page;
      fetchPosts();
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSearch = () => {
      currentPage.value = 1;
      fetchPosts();
    };
    
    const handleCategoryChange = () => {
      currentPage.value = 1;
      fetchPosts();
    };
    
    const getImageUrl = (image) => {
      if (image && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:'))) {
        return image;
      }
      return image ? `/uploads/${image}` : '/images/default-post.jpg';
    };
    
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const getExcerpt = (content) => {
      // Remove HTML tags and get plain text
      const plainText = content.replace(/<[^>]+>/g, '');
      // Get first 150 characters
      return plainText.length > 150 
        ? `${plainText.substring(0, 150)}...` 
        : plainText;
    };
    
    // Lifecycle hooks
    onMounted(async () => {
      await Promise.all([fetchPosts(), fetchCategories()]);
    });
    
    return {
      posts,
      categories,
      loading,
      error,
      currentPage,
      totalPages,
      searchQuery,
      selectedCategory,
      isLoggedIn,
      pageNumbers,
      changePage,
      handleSearch,
      handleCategoryChange,
      getImageUrl,
      formatDate,
      getExcerpt
    };
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h1 {
  font-size: 2.5rem;
  color: #0f3460;
  margin-bottom: 1rem;
}

.welcome-section p {
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 2rem;
}

.create-post-cta {
  margin-top: 2rem;
}

.create-post-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e94560;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  transition: transform 0.3s, background-color 0.3s;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(233, 69, 96, 0.2);
}

.create-post-button:hover {
  transform: translateY(-2px);
  background-color: #d13355;
}

.create-post-button span {
  font-size: 1.4rem;
  font-weight: bold;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-bar {
  flex: 2;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.category-filter {
  flex: 1;
}

.category-filter select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.featured-posts {
  margin-top: 3rem;
}

.featured-posts h2 {
  margin-bottom: 1.5rem;
  color: #0f3460;
  font-size: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.post-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.post-image {
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.post-title a {
  color: #0f3460;
  text-decoration: none;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-excerpt {
  color: #444;
  margin-bottom: 1.5rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.read-more {
  color: #0f3460;
  font-weight: 500;
  text-decoration: none;
}

.post-stats {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 3rem;
}

.error {
  color: #e94560;
}

.no-posts-cta {
  margin-top: 2rem;
}

.create-post-link {
  display: inline-block;
  background-color: #0f3460;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 1rem;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  gap: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #0f3460;
  color: white;
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
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-number.active {
  background-color: #0f3460;
  color: white;
  border-color: #0f3460;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
