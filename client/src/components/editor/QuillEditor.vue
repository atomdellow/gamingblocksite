<template>
  <div class="quill-editor-container">
    <QuillEditor
      v-model:content="editorContent"
      contentType="html"
      :toolbar="toolbarOptions"
      theme="snow"
      @update:content="updateContent"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  name: 'QuillEditor',
  components: {
    QuillEditor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editorContent = ref('')
    
    // Toolbar options
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image', 'video']                         // link and image, video
    ]
    
    // Initialize content from props
    onMounted(() => {
      editorContent.value = props.modelValue
    })
    
    // Watch for external changes
    watch(() => props.modelValue, (newVal) => {
      if (newVal !== editorContent.value) {
        editorContent.value = newVal
      }
    })
    
    // Update parent when content changes
    const updateContent = (content) => {
      emit('update:modelValue', content)
    }
    
    return {
      editorContent,
      toolbarOptions,
      updateContent
    }
  }
}
</script>

<style>
.quill-editor-container {
  margin-bottom: 20px;
}

.quill-editor-container .ql-editor {
  min-height: 300px;
  font-size: 1rem;
  line-height: 1.5;
}
</style>
