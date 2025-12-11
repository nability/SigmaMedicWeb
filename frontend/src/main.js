import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css' // Tailwind aktif

createApp(App).use(router).mount('#app')
