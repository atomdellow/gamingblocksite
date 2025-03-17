<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <button type="button" @click="executeCommand('bold')" title="Bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
        </svg>
      </button>
      <button type="button" @click="executeCommand('italic')" title="Italic">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
        </svg>
      </button>
      <button type="button" @click="executeCommand('underline')" title="Underline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
        </svg>
      </button>
      <button type="button" @click="executeCommand('strikeThrough')" title="Strike through">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"/>
        </svg>
      </button>
      <span class="separator"></span>
      <button type="button" @click="executeCommand('formatBlock', 'H1')" title="Heading 1">
        <span class="heading-btn">H1</span>
      </button>
      <button type="button" @click="executeCommand('formatBlock', 'H2')" title="Heading 2">
        <span class="heading-btn">H2</span>
      </button>
      <button type="button" @click="executeCommand('formatBlock', 'H3')" title="Heading 3">
        <span class="heading-btn">H3</span>
      </button>
      <span class="separator"></span>
      <button type="button" @click="executeCommand('insertUnorderedList')" title="Bullet list">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
      </button>
      <button type="button" @click="executeCommand('insertOrderedList')" title="Numbered list">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
          <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
        </svg>
      </button>
      <span class="separator"></span>
      <button type="button" @click="createLink()" title="Insert link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
        </svg>
      </button>
      <button type="button" @click="insertImage()" title="Insert image">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
        </svg>
      </button>
      <span class="separator"></span>
      <button type="button" @click="handleParagraph" title="Paragraph">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.5 1h-4v7h-1V8h1v7h1V8h3V1zm-1 7h-2V2h2v6z"/>
        </svg>
      </button>
    </div>
    
    <div
      class="editor-content"
      ref="editorContent"
      contenteditable="true"
      @input="updateContent"
      @paste="handlePaste"
      @keydown="handleKeyDown"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'RichTextEditor',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:modelValue'],
  
  data() {
    return {
      content: ''
    }
  },
  
  mounted() {
    this.initEditor()
  },
  
  watch: {
    modelValue(newVal) {
      // Only update if the content is different to prevent cursor jumping
      if (newVal !== this.content) {
        this.$refs.editorContent.innerHTML = newVal || ''
        this.content = newVal
      }
    }
  },
  
  methods: {
    initEditor() {
      this.$refs.editorContent.innerHTML = this.modelValue || ''
      this.content = this.modelValue
      
      // Focus on the editor
      this.$refs.editorContent.focus()
    },
    
    updateContent() {
      this.content = this.$refs.editorContent.innerHTML
      this.$emit('update:modelValue', this.content)
    },
    
    executeCommand(command, value = null) {
      document.execCommand(command, false, value)
      this.$refs.editorContent.focus()
      this.updateContent()
    },
    
    createLink() {
      const url = prompt('Enter the URL:')
      if (url) {
        this.executeCommand('createLink', url)
      }
    },
    
    handleParagraph() {
      this.executeCommand('formatBlock', 'p')
    },
    
    handlePaste(event) {
      // Prevent default paste behavior
      event.preventDefault()
      
      // Get plain text from clipboard
      const text = (event.clipboardData || window.clipboardData).getData('text/plain')
      
      // Convert line breaks to <br> tags
      const formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\r/g, '')
      
      // Insert at cursor position
      document.execCommand('insertHTML', false, formattedText)
      this.updateContent()
    },
    
    handleKeyDown(event) {
      // Special handling for Enter key to ensure consistent line breaks
      if (event.key === 'Enter' && !event.shiftKey) {
        // Let the browser handle it but make sure our content gets updated
        setTimeout(() => this.updateContent(), 10)
      }
    },
    
    insertImage() {
      const url = prompt('Enter the image URL:')
      if (url) {
        this.executeCommand('insertImage', url)
      }
    }
  }
}
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.editor-toolbar button {
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background-color: #e9e9e9;
}

.editor-toolbar button svg {
  width: 16px;
  height: 16px;
}

.separator {
  width: 1px;
  height: 20px;
  background-color: #ddd;
  margin: 0 5px;
}

.editor-content {
  min-height: 300px;
  padding: 15px;
  overflow-y: auto;
  line-height: 1.5;
}

.editor-content:focus {
  outline: none;
}

.editor-content[placeholder]:empty:before {
  content: attr(placeholder);
  color: #999;
}

.heading-btn {
  font-weight: bold;
  font-family: serif;
}
</style>
