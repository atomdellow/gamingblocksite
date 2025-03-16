<template>
  <div class="create-post-container">
    <h1>Create New Post</h1>
    
    <div v-if="error" class="alert error">{{ error }}</div>
    
    <form @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label for="title">Post Title</label>
        <input
          id="title"
          v-model="postData.title"
          type="text"
          placeholder="Enter post title"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="category">Category</label>
        <div v-if="loadingCategories" class="loading-indicator">Loading categories...</div>
        <select id="category" v-model="postData.category" required>
          <option disabled value="">Select a category</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
        <div v-if="categories.length === 0 && !loadingCategories" class="no-categories">
          No categories available. Please contact an administrator.
        </div>
      </div>
      
      <div class="form-group">
        <label for="tags">Tags</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="Enter tags separated by commas"
        />
        <div class="tags-preview" v-if="postData.tags.length > 0">
          <span v-for="(tag, index) in postData.tags" :key="index" class="tag">
            {{ tag }} 
            <button type="button" @click="removeTag(index)" class="remove-tag">&times;</button>
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="featuredImage">Featured Image URL</label>
        <input
          id="featuredImage"
          v-model="postData.featuredImage"
          type="text"
          placeholder="Enter image URL"
        />
        <div class="image-upload">
          <input type="file" ref="fileInput" @change="handleImageUpload" class="file-input" accept="image/*" />
          <button type="button" @click="triggerFileInput" class="upload-btn">Upload Image</button>
        </div>
        <div v-if="imageUploadStatus" class="upload-status">{{ imageUploadStatus }}</div>
        <div class="image-preview" v-if="postData.featuredImage">
          <img :src="postData.featuredImage" alt="Featured image preview">
        </div>
      </div>
      
      <div class="form-group">
        <label>Content</label>
        <RichTextEditor v-model="postData.content" />
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="postData.published">
          Publish immediately
        </label>
      </div>
      
      <div class="form-footer">
        <button type="button" class="cancel-button" @click="cancelPost">Cancel</button>
        <button type="submit" class="submit-button" :disabled="loading || !canSubmit">
          {{ loading ? 'Creating...' : 'Create Post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import { useCategoriesStore } from '../stores/categories'
import RichTextEditor from '../components/editor/RichTextEditor.vue'

export default {
  name: 'CreatePostView',
  components: {
    RichTextEditor
  },
  
  setup() {
    const router = useRouter()
    const postsStore = usePostsStore()
    const categoriesStore = useCategoriesStore()
    const fileInput = ref(null)
    const imageUploadStatus = ref('')
    const loadingCategories = ref(true)

    const postData = ref({
      title: '',
      category: '',
      content: '',
      featuredImage: '',
      tags: [],
      published: true
    })

    const tagsInput = ref('')
    const error = ref('')
    const loading = ref(false)

    // Computed property to determine if form can be submitted
    const canSubmit = computed(() => {
      return postData.value.title && 
             postData.value.category && 
             postData.value.content;
    });

    // Access categories from the store
    const categories = computed(() => categoriesStore.categories || [])

    watch(tagsInput, (newValue) => {
      if (newValue.endsWith(',')) {
        const tag = newValue.slice(0, -1).trim()
        if (tag && !postData.value.tags.includes(tag)) {
          postData.value.tags.push(tag)
        }
        tagsInput.value = ''
      }
    })

    const removeTag = (index) => {
      postData.value.tags.splice(index, 1)
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleImageUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      imageUploadStatus.value = 'Uploading image...'
      
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          postData.value.featuredImage = e.target.result
          imageUploadStatus.value = 'Image uploaded successfully!'
          setTimeout(() => {
            imageUploadStatus.value = ''
          }, 3000)
        }
        reader.readAsDataURL(file)
      } catch (err) {
        imageUploadStatus.value = 'Error uploading image'
        console.error('Error uploading image:', err)
      }
    }

    const handleSubmit = async () => {
      if (loading.value) return
      
      // Add any remaining tag
      if (tagsInput.value.trim()) {
        const tag = tagsInput.value.trim()
        if (!postData.value.tags.includes(tag)) {
          postData.value.tags.push(tag)
        }
        tagsInput.value = ''
      }
      
      // Validate fields
      if (!canSubmit.value) {
        error.value = 'Please fill in all required fields'
        return
      }
      
      error.value = ''
      loading.value = true
      
      try {
        const post = await postsStore.createPost(postData.value)
        router.push(`/posts/${post._id}`)
      } catch (err) {
        console.error('Error creating post:', err)
        error.value = err.response?.data?.error || 'Failed to create post. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const cancelPost = () => {
      if (confirm('Are you sure you want to cancel? All your changes will be lost.')) {
        router.go(-1)
      }
    }

    onMounted(async () => {
      loadingCategories.value = true
      try {
        await categoriesStore.fetchCategories()
        
        // Debug logging
        console.log('Categories loaded:', categoriesStore.categories)
        
        if (categoriesStore.categories.length > 0 && !postData.value.category) {
          // Auto-select first category if none selected
          postData.value.category = categoriesStore.categories[0]._id
        }
      } catch (err) {
        error.value = 'Failed to load categories'
        console.error('Error loading categories:', err)
      } finally {
        loadingCategories.value = false
      }
    })

    return {
      postData,
      tagsInput,
      error,
      loading,
      loadingCategories,
      fileInput,
      imageUploadStatus,
      categories,
      canSubmit,
      removeTag,
      triggerFileInput,
      handleImageUpload,
      handleSubmit,
      cancelPost
    }
  }
}
</script>

<style scoped>
.create-post-container {
  max-width: 800px;
  margin: 0 auto;
}

.create-post-container h1 {
  margin-bottom: 2rem;
}

.alert {
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
}

.alert.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.post-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0f3460;
  box-shadow: 0 0 0 2px rgba(15, 52, 96, 0.2);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 0.3rem 0.75rem;
  font-size: 0.9rem;
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.3rem;
  color: #666;
}

.image-upload {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.upload-btn {
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.cancel-button {
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
}

.submit-button {
  background-color: #0f3460;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.file-input {
  display: none;
}

.upload-status {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}

.loading-indicator {
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.no-categories {
  color: #e94560;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>