<template>
  <div class="rich-text-editor">
    <div class="editor-container">
      <!-- Use a simple textarea for now -->
      <textarea
        ref="editorEl"
        v-model="editorContent"
        class="editor-area"
        placeholder="Write your content here..."
        @input="updateValue"
      ></textarea>
      <div class="editor-toolbar">
        <button type="button" @click="formatText('bold')" title="Bold">B</button>
        <button type="button" @click="formatText('italic')" title="Italic"><i>I</i></button>
        <button type="button" @click="formatText('underline')" title="Underline"><u>U</u></button>
        <button type="button" @click="insertLink()" title="Insert Link">Link</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Write your content here...'
    }
  },
  emits: ['update:modelValue', 'change'],
  
  data() {
    return {
      editorContent: this.modelValue || ''
    }
  },
  
  watch: {
    modelValue(newVal) {
      if (newVal !== this.editorContent) {
        this.editorContent = newVal;
      }
    }
  },
  
  methods: {
    updateValue() {
      this.$emit('update:modelValue', this.editorContent);
      this.$emit('change', {
        content: this.editorContent
      });
    },
    
    formatText(format) {
      // Basic text formatting - in a real implementation, this would be more sophisticated
      alert(`Format as ${format} - This is a placeholder. Install @vueup/vue-quill for full editor functionality.`);
    },
    
    insertLink() {
      const url = prompt('Enter the URL:');
      if (url) {
        const linkText = prompt('Enter the link text:', url);
        const link = `<a href="${url}" target="_blank">${linkText || url}</a>`;
        this.editorContent += link;
        this.updateValue();
      }
    }
  }
}
</script>

<style scoped>
.rich-text-editor {
  border-radius: 4px;
  margin-bottom: 1rem;
  background-color: white;
}

.editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.editor-area {
  width: 100%;
  min-height: 300px;
  border: none;
  padding: 1rem;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}

.editor-toolbar button {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
}

.editor-toolbar button:hover {
  background-color: #f0f0f0;
}
</style>
