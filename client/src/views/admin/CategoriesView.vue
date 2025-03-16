<template>
  <div class="admin-categories">
    <div class="page-header">
      <h1>Manage Categories</h1>
      <button @click="openCategoryModal()" class="create-button">
        Create New Category
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      Loading categories...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else>
      <div class="table-container">
        <table class="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Posts</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category._id">
              <td>{{ category.name }}</td>
              <td>{{ category.slug }}</td>
              <td>{{ category.description || 'No description' }}</td>
              <td>{{ getPostCount(category._id) }}</td>
              <td>{{ formatDate(category.createdAt) }}</td>
              <td class="actions">
                <button 
                  @click="openCategoryModal(category)" 
                  class="action-button edit"
                >
                  Edit
                </button>
                <button 
                  @click="deleteCategory(category._id)" 
                  class="action-button delete"
                  :disabled="getPostCount(category._id) > 0"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="categories.length === 0">
              <td colspan="6" class="no-categories">No categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Category Modal -->
    <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <h2>{{ editingCategory ? 'Edit Category' : 'Create New Category' }}</h2>
        
        <div v-if="modalError" class="alert error">
          {{ modalError }}
        </div>
        
        <div class="form-group">
          <label for="categoryName">Name</label>
          <input 
            id="categoryName" 
            v-model="categoryForm.name" 
            type="text" 
            required 
            placeholder="Category name"
          />
        </div>
        
        <div class="form-group">
          <label for="categoryDescription">Description (optional)</label>
          <textarea 
            id="categoryDescription" 
            v-model="categoryForm.description"
            rows="3"
            placeholder="Category description"
          ></textarea>
        </div>
        
        <div class="modal-footer">
          <button @click="showModal = false" class="cancel-button">Cancel</button>
          <button 
            @click="saveCategory" 
            class="save-button"
            :disabled="!categoryForm.name.trim() || submitting"
          >
            {{ submitting ? 'Saving...' : 'Save Category' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoriesStore } from '../../stores/categories'
import { usePostsStore } from '../../stores/posts'

const categoriesStore = useCategoriesStore()
const postsStore = usePostsStore()

const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const editingCategory = ref(null)
const modalError = ref('')
const submitting = ref(false)
const postCounts = ref({}) // Map of category ID to post count

const categories = computed(() => categoriesStore.categories)

const categoryForm = ref({
  name: '',
  description: ''
})

const getPostCount = (categoryId) => {
  return postCounts.value[categoryId] || 0
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const openCategoryModal = (category = null) => {
  editingCategory.value = category
  
  if (category) {
    categoryForm.value = {
      name: category.name,
      description: category.description || ''
    }
  } else {
    categoryForm.value = {
      name: '',
      description: ''
    }
  }
  
  modalError.value = ''
  showModal.value = true
}

const saveCategory = async () => {
  if (!categoryForm.value.name.trim() || submitting.value) return
  
  submitting.value = true
  modalError.value = ''
  
  try {
    if (editingCategory.value) {
      // Update existing category
      await categoriesStore.updateCategory(editingCategory.value._id, categoryForm.value)
    } else {
      // Create new category
      await categoriesStore.createCategory(categoryForm.value)
    }
    
    showModal.value = false
  } catch (err) {
    modalError.value = err.response?.data?.error || 'Failed to save category'
  } finally {
    submitting.value = false
  }
}

const deleteCategory = async (categoryId) => {
  // Check if category has posts
  if (getPostCount(categoryId) > 0) {
    alert('Cannot delete a category that has posts. Reassign posts first.')
    return
  }
  
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await categoriesStore.deleteCategory(categoryId)
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to delete category'
    }
  }
}

const fetchPostCounts = async () => {
  try {
    // In a real app, you'd have an endpoint to get post counts by category
    // Mocking this functionality by counting posts from all fetched posts
    const response = await postsStore.fetchPosts({ limit: 1000 })
    const allPosts = response.data || []
    
    // Count posts per category
    const counts = {}
    allPosts.forEach(post => {
      const categoryId = post.category._id || post.category
      counts[categoryId] = (counts[categoryId] || 0) + 1
    })
    
    postCounts.value = counts
  } catch (err) {
    console.error('Failed to fetch post counts:', err)
  }
}

onMounted(async () => {
  try {
    // Load categories
    if (categoriesStore.categories.length === 0) {
      await categoriesStore.fetchCategories()
    }
    
    // Get post counts for categories
    await fetchPostCounts()
  } catch (err) {
    error.value = 'Failed to load categories'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-categories {
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
  border: none;
  cursor: pointer;
}

.create-button:hover {
  background-color: #0a2748;
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

.categories-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.categories-table th,
.categories-table td {
  padding: 1rem;
  text-align: left;
}

.categories-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.categories-table tr {
  border-bottom: 1px solid #eee;
}

.categories-table tr:last-child {
  border-bottom: none;
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

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-categories {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
}

.alert.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  padding: 0.75rem 1rem;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0f3460;
  box-shadow: 0 0 0 2px rgba(15, 52, 96, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button,
.save-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
}

.save-button {
  background-color: #0f3460;
  color: white;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
