<template>
  <div class="admin-dashboard">
    <div class="admin-sidebar">
      <h2>Admin Dashboard</h2>
      <nav class="admin-nav">
        <router-link :to="{ name: 'admin-posts' }" class="nav-item">
          <i class="icon-document"></i> Posts
        </router-link>
        <router-link :to="{ name: 'admin-categories' }" class="nav-item">
          <i class="icon-folder"></i> Categories
        </router-link>
        <router-link :to="{ name: 'admin-users' }" class="nav-item">
          <i class="icon-users"></i> Users
        </router-link>
      </nav>
    </div>
    
    <div class="admin-content">
      <!-- If on main dashboard page, show stats, otherwise show child route -->
      <div v-if="$route.name === 'admin'" class="dashboard-overview">
        <h1>Dashboard Overview</h1>
        
        <div class="stats-cards">
          <div class="stat-card">
            <h3>Total Posts</h3>
            <div class="stat-value">{{ stats.postsCount }}</div>
          </div>
          
          <div class="stat-card">
            <h3>Total Users</h3>
            <div class="stat-value">{{ stats.usersCount }}</div>
          </div>
          
          <div class="stat-card">
            <h3>Categories</h3>
            <div class="stat-value">{{ stats.categoriesCount }}</div>
          </div>
          
          <div class="stat-card">
            <h3>Comments</h3>
            <div class="stat-value">{{ stats.commentsCount }}</div>
          </div>
        </div>
        
        <div class="recent-activities">
          <h2>Recent Activities</h2>
          <div v-if="loading" class="loading">Loading activities...</div>
          <div v-else-if="activities.length === 0" class="no-activities">
            No recent activity to display.
          </div>
          <ul v-else class="activities-list">
            <li v-for="(activity, index) in activities" :key="index" class="activity-item">
              <div class="activity-icon" :class="getActivityIconClass(activity.type)"></div>
              <div class="activity-details">
                <div class="activity-message">{{ activity.message }}</div>
                <div class="activity-time">{{ formatDate(activity.timestamp) }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <router-view v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const stats = ref({
  postsCount: 0,
  usersCount: 0,
  categoriesCount: 0,
  commentsCount: 0
})
const activities = ref([])

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const getActivityIconClass = (type) => {
  switch (type) {
    case 'post':
      return 'post-activity'
    case 'user':
      return 'user-activity'
    case 'comment':
      return 'comment-activity'
    case 'category':
      return 'category-activity'
    default:
      return ''
  }
}

const fetchDashboardData = async () => {
  loading.value = true
  
  try {
    // In a real app, you'd fetch this data from your backend API
    // Mock data for demonstration
    setTimeout(() => {
      stats.value = {
        postsCount: 42,
        usersCount: 156,
        categoriesCount: 8,
        commentsCount: 324
      }
      
      activities.value = [
        {
          type: 'post',
          message: 'New post "PlayStation 5 Review" was published by Sarah Chen.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          type: 'user',
          message: 'New user "gamerlover22" registered.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
          type: 'comment',
          message: 'Marcus Williams commented on "Xbox Series X vs PS5".',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
        },
        {
          type: 'category',
          message: 'New category "Retro Gaming" was created by admin.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        }
      ]
      
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: calc(100vh - 200px); /* Adjust based on your header/footer height */
}

.admin-sidebar {
  width: 250px;
  background-color: #1a1a2e;
  color: white;
  padding: 2rem 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.admin-sidebar h2 {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2c2c4a;
  font-size: 1.5rem;
}

.admin-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #e6e6e6;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.nav-item:hover {
  background-color: #2c2c4a;
}

.router-link-active {
  background-color: #0f3460;
  color: white;
  font-weight: 600;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.dashboard-overview h1 {
  margin-bottom: 2rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #0f3460;
}

.recent-activities {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.recent-activities h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.loading, .no-activities {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.activities-list {
  list-style: none;
  padding: 0;
}

.activity-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-activity {
  background-color: #e3f2fd;
  color: #1976d2;
}

.user-activity {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.comment-activity {
  background-color: #fff8e1;
  color: #ff8f00;
}

.category-activity {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.activity-details {
  flex: 1;
}

.activity-message {
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.85rem;
  color: #888;
}

@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    padding: 1rem;
  }
  
  .admin-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .nav-item {
    margin-right: 1rem;
    margin-bottom: 0;
    white-space: nowrap;
  }
}
</style>
