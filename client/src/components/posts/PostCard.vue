<template>
  <div class="post-card">
    <div class="post-image">
      <img :src="getImageUrl(post.featuredImage)" :alt="post.title">
    </div>
    <div class="post-content">
      <div class="post-category">
        <router-link :to="`/category/${post.category.slug}`">
          {{ post.category.name }}
        </router-link>
      </div>
      <h2 class="post-title">
        <router-link :to="`/posts/${post._id}`">
          {{ post.title }}
        </router-link>
      </h2>
      <div class="post-meta">
        <div class="post-author">
          By {{ post.author.username }}
        </div>
        <div class="post-date">
          {{ formatDate(post.createdAt) }}
        </div>
      </div>
      <div class="post-excerpt" v-html="truncateContent(post.content)"></div>
      <div class="post-footer">
        <router-link :to="`/posts/${post._id}`" class="read-more">
          Read More
        </router-link>
        <div class="post-stats">
          <span class="likes-count">
            <i class="icon-heart"></i> {{ post.likes.length }}
          </span>
          <span class="comments-count">
            <i class="icon-comment"></i> {{ post.comments?.length || 0 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const getImageUrl = (image) => {
  // Check if image is a full URL
  if (image && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image
  }
  // Fall back to local path or default
  return image ? `/uploads/${image}` : '/images/default-post.jpg'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const truncateContent = (content) => {
  // Strip HTML tags
  const strippedContent = content.replace(/<[^>]*>/g, '')
  // Truncate to 150 characters
  return strippedContent.length > 150
    ? strippedContent.substring(0, 150) + '...'
    : strippedContent
}
</script>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-image {
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.post-category a {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #e94560;
  text-decoration: none;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.post-title {
  margin-bottom: 1rem;
}

.post-title a {
  color: #1a1a2e;
  text-decoration: none;
  font-size: 1.4rem;
  line-height: 1.3;
}

.post-title a:hover {
  color: #e94560;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.post-excerpt {
  margin-bottom: 1.5rem;
  color: #444;
  line-height: 1.6;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.read-more {
  display: inline-block;
  color: #e94560;
  text-decoration: none;
  font-weight: 600;
}

.read-more:hover {
  text-decoration: underline;
}

.post-stats {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
