<template>
  <div class="admin-users">
    <div class="page-header">
      <h1>Manage Users</h1>
    </div>
    
    <div class="filters">
      <div class="filter-group">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search users..." 
          @input="applyFilters"
        />
      </div>
      <div class="filter-group">
        <select v-model="roleFilter" @change="applyFilters">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      Loading users...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Posts</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user._id">
              <td>
                <div class="user-info">
                  <img :src="getUserAvatar(user)" :alt="user.username" class="user-avatar">
                  <span>{{ user.username }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" :class="user.role">
                  {{ user.role }}
                </span>
              </td>
              <td>{{ getUserPostCount(user._id) }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td class="actions">
                <button @click="toggleUserRole(user)" class="action-button role">
                  {{ user.role === 'admin' ? 'Make User' : 'Make Admin' }}
                </button>
                <button 
                  @click="deleteUser(user._id)" 
                  class="action-button delete"
                  :disabled="user.role === 'admin' || user._id === currentUserId"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="6" class="no-users">No users found.</td>
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
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const users = ref([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const searchTerm = ref('')
const roleFilter = ref('')
const userPostCounts = ref({}) // Map of user ID to post count

const currentUserId = computed(() => authStore.user?.id)

// Filter users based on search term and role
const filteredUsers = computed(() => {
  if (!users.value.length) return []
  
  return users.value.filter(user => {
    // Search filter (username or email)
    const searchMatch = !searchTerm.value || 
      user.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    // Role filter
    const roleMatch = !roleFilter.value || user.role === roleFilter.value
    
    return searchMatch && roleMatch
  })
})

// Get paginated users for current page
const paginatedUsers = computed(() => {
  const filtered = filteredUsers.value
  
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

const totalPages = ref(1)

const getUserAvatar = (user) => {
  if (user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://'))) {
    return user.avatar
  }
  return user.avatar ? `/uploads/${user.avatar}` : '/images/default-avatar.png'
}

const getUserPostCount = (userId) => {
  return userPostCounts.value[userId] || 0
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

const toggleUserRole = async (user) => {
  try {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    
    // In a real app, you'd call an API to update the user role
    // Mock implementation for demo
    user.role = newRole
    
    // Update local state
    users.value = [...users.value]
  } catch (err) {
    error.value = 'Failed to update user role'
  }
}

const deleteUser = async (userId) => {
  // Don't allow deleting admins or current user
  const user = users.value.find(u => u._id === userId)
  if (user.role === 'admin' || userId === currentUserId.value) {
    return
  }
  
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      // In a real app, you'd call an API to delete the user
      // Mock implementation for demo
      users.value = users.value.filter(u => u._id !== userId)
      
      // If the current page becomes empty after deleting and it's not the first page,
      // go back to the previous page
      if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } catch (err) {
      error.value = 'Failed to delete user'
    }
  }
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, you'd fetch users from an API
    // Mock implementation for demo
    setTimeout(() => {
      users.value = [
        {
          _id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          avatar: null,
          createdAt: new Date('2023-01-01')
        },
        {
          _id: '2',
          username: 'sarah_chen',
          email: 'sarah@example.com',
          role: 'admin',
          avatar: null,
          createdAt: new Date('2023-01-15')
        },
        {
          _id: '3',
          username: 'marcus_williams',
          email: 'marcus@example.com',
          role: 'user',
          avatar: null,
          createdAt: new Date('2023-02-10')
        },
        {
          _id: '4',
          username: 'lucia_rodriguez',
          email: 'lucia@example.com',
          role: 'user',
          avatar: null,
          createdAt: new Date('2023-03-05')
        },
        {
          _id: '5',
          username: 'gamer123',
          email: 'gamer@example.com',
          role: 'user',
          avatar: null,
          createdAt: new Date('2023-04-20')
        }
      ]
      
      // Mock post counts
      userPostCounts.value = {
        '1': 5,
        '2': 12,
        '3': 8,
        '4': 6,
        '5': 0
      }
      
      loading.value = false
    }, 1000)
  } catch (err) {
    error.value = 'Failed to load users'
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
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

.users-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
}

.users-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.users-table tr {
  border-bottom: 1px solid #eee;
}

.users-table tr:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.role-badge {
  display: inline-block;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
}

.role-badge.admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.user {
  background-color: #f5f5f5;
  color: #333;
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

.action-button.role {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.action-button.delete {
  background-color: #ffebee;
  color: #c62828;
}

.action-button.role:hover {
  background-color: #c8e6c9;
}

.action-button.delete:hover {
  background-color: #ffcdd2;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-users {
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
