import { createRouter, createWebHistory } from 'vue-router'
import Sign_In from '../views/Sign_In.vue'
import Sign_Up from '../views/Sign_Up.vue'
import Beranda from '../views/Beranda.vue'
import Profile from '../views/Profile.vue'
import Layanan from '../views/Layanan.vue'
import Produk from '../views/Produk.vue'
import Kontak from '../views/Kontak.vue'

const routes = [
  { path: '/', redirect: '/Beranda' },
  { path: '/Sign_In', name: 'Sign_In', component: Sign_In },
  { path: '/Sign_Up', name: 'Sign_Up', component: Sign_Up },
  { path: '/Beranda', name: 'Beranda', component: Beranda },
  { path: '/Profile', name: 'Profile', component: Profile },
  { path: '/Layanan', name: 'Layanan', component: Layanan },
  { path: '/Produk', name: 'Produk', component: Produk },
  { path: '/Kontak', name: 'Kontak', component: Kontak },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
