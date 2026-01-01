import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/firebase'
import axios from 'axios'

// Import Views
import Sign_In from '../views/Sign_In.vue'
import Sign_Up from '../views/Sign_Up.vue'
import Beranda from '../views/Beranda.vue'
import Produk from '../views/Produk.vue'
import TentangKami from '../views/TentangKami.vue'
import UserDashboard from '../views/UserDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue' // Pastikan file ini ada
import Kontak from '../views/Kontak.vue'

const routes = [
  { path: '/', redirect: '/Beranda' },
  { path: '/Beranda', name: 'Beranda', component: Beranda },
  { path: '/Produk', name: 'Produk', component: Produk },
  { path: '/tentang-kami', name: 'TentangKami', component: TentangKami },
  { path: '/Kontak', name: 'Kontak', component: Kontak },

  // Auth Routes
  { path: '/Sign_In', name: 'Sign_In', component: Sign_In, meta: { requiresGuest: true } },
  { path: '/Sign_Up', name: 'Sign_Up', component: Sign_Up, meta: { requiresGuest: true } },

  // Protected Routes
  { path: '/akun', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true } },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// === NAVIGATION GUARD PINTAR ===
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  const currentUser = await getCurrentUser()

  // Cek Role dari LocalStorage (lebih cepat daripada request ulang)
  const role = localStorage.getItem('user_role')

  // 1. Jika butuh login tapi tidak ada user
  if (requiresAuth && !currentUser) {
    next('/Sign_In')
  }
  // 2. Jika halaman Guest (Login/Register) tapi user sudah login
  else if (requiresGuest && currentUser) {
    if (role === 'admin') {
      next('/admin') // Admin dilempar ke Dashboard Admin     } else {
      next('/akun')  // User biasa dilempar ke Dashboard User
    }
  }
  // 3. Jika halaman khusus Admin
  else if (requiresAdmin) {
    if (role !== 'admin') {
      next('/akun') // User biasa coba akses admin -> tendang ke akun
    } else {
      next() // Admin boleh masuk
    }
  }
  else {
    next()
  }
})

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

export default router
