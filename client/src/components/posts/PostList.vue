<template>
  <div class="post-list">
    <div v-if="loading" class="loading">
      Loading posts...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="posts.length === 0" class="no-posts">
      No posts found.
    </div>
    <div v-else class="posts-grid">
      <PostCard 
        v-for="post in posts" 
        :key="post._id" 
        :post="post" 
      />
    </div>
    
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="pagination-button" 
        :disabled="currentPage === 1"
        @click="handlePagination(currentPage - 1)"
      >
        Previous
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in paginationPages" 
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="handlePagination(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-button" 
        :disabled="currentPage === totalPages"
        @click="handlePagination(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import PostCard from './PostCard.vue'

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['paginate'])

const handlePagination = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('paginate', page)
  }
}

// Generate array of page numbers for pagination, with ellipsis for large ranges
const paginationPages = computed(() => {
  const totalPages = props.totalPages
  const currentPage = props.currentPage
  
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  } else if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  } else {
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }
})
</script>

<style scoped>
.post-list {
  width: 100%;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading,
.error,
.no-posts {
  text-align: center;
  padding: 2rem;
  margin: 2rem 0;
}

.error {
  color: #e94560;
}

.pagination {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-button {
  background: #0f3460;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  background: none;
  border: 1px solid #0f3460;
  color: #0f3460;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}

.page-number.active {
  background: #0f3460;
  color: white;
}
</style>
