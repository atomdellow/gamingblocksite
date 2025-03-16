<template>
  <div class="rich-text-content" v-if="content">
    <div v-html="sanitizedContent" class="content-area"></div>
  </div>
  <div v-else class="empty-content">
    No content to display
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// Sanitize HTML to prevent XSS attacks
const sanitizedContent = computed(() => {
  if (!props.content) return ''
  return DOMPurify.sanitize(props.content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 
      'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
      'img', 'span', 'sub', 'sup'
    ],
    ALLOWED_ATTR: [
      'href', 'name', 'target', 'src', 'alt', 'class', 'id', 'style',
      'rel', 'width', 'height'
    ]
  })
})
</script>

<style scoped>
.rich-text-content {
  width: 100%;
  line-height: 1.6;
  font-size: 1.1rem;
}

.content-area {
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.content-area :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

.content-area :deep(h1),
.content-area :deep(h2),
.content-area :deep(h3),
.content-area :deep(h4),
.content-area :deep(h5),
.content-area :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.content-area :deep(ul),
.content-area :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.content-area :deep(blockquote) {
  border-left: 4px solid #e94560;
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
  color: #555;
}

.content-area :deep(pre) {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.content-area :deep(a) {
  color: #0f3460;
  text-decoration: underline;
}

.content-area :deep(a:hover) {
  color: #e94560;
}

.empty-content {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>
