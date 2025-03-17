<template>
  <div class="rich-text-content" v-if="content">
    <div v-html="sanitizedContent" class="content-area"></div>
  </div>
  <div v-else class="empty-content">
    No content to display
  </div>
</template>

<script>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

export default {
  name: 'RichTextContent',
  
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  
  setup(props) {
    // Process content to ensure line breaks work properly
    const processContent = (content) => {
      if (!content) return ''
      
      // Ensure paragraphs are separated properly
      // This is a fallback if editor doesn't handle paragraph formatting correctly
      let processed = content
      
      // Fix any plain text line breaks that might not be proper HTML
      processed = processed.replace(/\n\s*\n/g, '</p><p>') // Double line breaks become new paragraphs
      processed = processed.replace(/\n/g, '<br>') // Single line breaks become <br>
      
      // Ensure content is wrapped in paragraph tags if it isn't already
      if (!processed.trim().startsWith('<')) {
        processed = `<p>${processed}</p>`
      }
      
      return processed
    }

    // Sanitize HTML to prevent XSS attacks
    const sanitizedContent = computed(() => {
      if (!props.content) return ''
      
      const processed = processContent(props.content)
      
      return DOMPurify.sanitize(processed, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
          'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 
          'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
          'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
          'img', 'span', 'sub', 'sup', 'u'
        ],
        ALLOWED_ATTR: [
          'href', 'name', 'target', 'src', 'alt', 'class', 'id', 'style',
          'rel', 'width', 'height'
        ]
      })
    })

    return {
      sanitizedContent
    }
  }
}
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

/* Ensure proper spacing between elements */
.content-area :deep(p) {
  margin: 1em 0;
}

.content-area :deep(br) {
  display: block; /* Make sure <br> tags work as expected */
  content: ""; /* Fix for some browsers */
  margin-top: 0.5em;
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

.content-area :deep(li) {
  margin-bottom: 0.5rem;
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

/* Apply proper styling for text formatting */
.content-area :deep(b),
.content-area :deep(strong) {
  font-weight: bold;
}

.content-area :deep(i),
.content-area :deep(em) {
  font-style: italic;
}

.content-area :deep(u) {
  text-decoration: underline;
}

.content-area :deep(strike) {
  text-decoration: line-through;
}

.empty-content {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>
