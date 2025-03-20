import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

// Add production error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.log('Error Info:', info)
}

app.use(pinia)
app.use(router)
app.mount('#app')