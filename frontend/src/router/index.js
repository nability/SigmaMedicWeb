import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/firebase'

// === IMPORT VIEWS ===
import Sign_In from '../views/Sign_In.vue'
import Sign_Up from '../views/Sign_Up.vue'
import Beranda from '../views/Beranda.vue'
import Produk from '../views/Produk.vue'
import TentangKami from '../views/TentangKami.vue'   // Halaman Profil Perusahaan (Public)
import UserDashboard from '../views/UserDashboard.vue' // Halaman Akun User (Private)
import Kontak from '../views/Kontak.vue' // Pastikan file ini ada jika ingin dipakai

const routes = [
  // 1. Redirect root ke Beranda
  { path: '/', redirect: '/Beranda' },

  // 2. Halaman PUBLIC (Bisa diakses siapa saja)
  { path: '/Beranda', name: 'Beranda', component: Beranda },
  { path: '/Produk', name: 'Produk', component: Produk },
  { path: '/tentang-kami', name: 'TentangKami', component: TentangKami },
  { path: '/Kontak', name: 'Kontak', component: Kontak },

  // 3. Halaman GUEST (Hanya untuk yang BELUM login)
  {
    path: '/Sign_In',
    name: 'Sign_In',
    component: Sign_In,
    meta: { requiresGuest: true }
  },
  {
    path: '/Sign_Up',
    name: 'Sign_Up',
    component: Sign_Up,
    meta: { requiresGuest: true }
  },

  // 4. Halaman USER (Hanya untuk yang SUDAH login)
  {
    path: '/akun',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// === NAVIGATION GUARD ===
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // Tunggu Firebase cek status user dulu
  const currentUser = await getCurrentUser()

  if (requiresAuth && !currentUser) {
    // Mau ke halaman Akun tapi belum login -> Lempar ke Sign In
    next('/Sign_In')
  } else if (requiresGuest && currentUser) {
    // Sudah login tapi coba akses Sign In/Sign Up -> Lempar ke Dashboard Akun
    next('/akun')
  } else {
    // Lanjut ke halaman yang dituju
    next()
  }
})

// Helper function untuk menunggu Firebase Auth Ready
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

export default router
