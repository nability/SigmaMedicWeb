<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const user = ref(null)
const loading = ref(true)

// Format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// Ambil data user
const fetchUserProfile = async () => {
  try {
    const token = await auth.currentUser.getIdToken()
    // Pastikan URL backend sesuai port anda
    const response = await axios.get('http://localhost:3000/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log("Data User:", response.data) // Cek di Console browser
    user.value = response.data
  } catch (error) {
    console.error("Gagal ambil data user:", error)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await auth.signOut()
  localStorage.removeItem('token')
  router.push('/Sign_In')
}

onMounted(() => {
  setTimeout(() => {
    if (auth.currentUser) {
      fetchUserProfile()
    } else {
      router.push('/Sign_In')
    }
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <Navbar />

    <div class="pt-28 pb-10 px-4 sm:px-6 max-w-5xl mx-auto">

      <div v-if="loading" class="flex flex-col justify-center items-center h-64 gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        <p class="text-gray-500 text-sm">Memuat profil...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        <div class="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div class="bg-gradient-to-r from-[#8FB584] to-[#A5C79B] h-28 w-full"></div>

          <div class="px-6 pb-8 text-center relative">
            <div class="-mt-12 mb-4 flex justify-center">
              <img
                :src="auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=fff&color=5B8A62&bold=true`"
                class="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
            </div>

            <h2 class="text-xl font-bold text-gray-800 break-words leading-tight">
              {{ user?.name || 'Nama Tidak Ditemukan' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1 mb-4">{{ user?.email }}</p>

            <span class="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full mb-6">
              {{ user?.role === 'admin' ? 'Administrator' : 'Member Sigma Medic' }}
            </span>

            <div class="border-t border-gray-100 pt-4 mb-6">
              <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Bergabung Sejak</p>
              <p class="text-sm font-medium text-gray-700">{{ formatDate(user?.created_at) }}</p>
            </div>

            <button
              @click="handleLogout"
              class="w-full py-2.5 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </div>
        </div>

        <div class="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 class="text-lg font-bold text-gray-800">Informasi Pribadi</h3>
            <button class="text-sm text-[#5B8A62] font-semibold hover:underline">
              Edit Detail
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <div class="text-gray-800 font-medium text-base bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                {{ user?.name || '-' }}
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <div class="text-gray-800 font-medium text-base bg-gray-50 px-3 py-2 rounded-md border border-gray-100 truncate">
                {{ user?.email || '-' }}
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nomor Telepon</label>
              <div class="text-gray-800 font-medium text-base bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                {{ user?.phone || '-' }}
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status Akun</label>
              <div class="text-gray-800 font-medium text-base bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                Aktif
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alamat Pengiriman</label>
              <div class="text-gray-800 font-medium text-base bg-gray-50 px-3 py-2 rounded-md border border-gray-100 min-h-[80px]">
                {{ user?.address || 'Belum ada alamat pengiriman yang diatur.' }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
