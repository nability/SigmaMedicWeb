import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { auth } from './firebase/firebase'

let app

// Tunggu Firebase Auth init baru mount Vue
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(router).mount('#app')
  }
})
