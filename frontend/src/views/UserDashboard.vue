<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const user = ref(null)
const orders = ref([]) // State untuk menyimpan riwayat pesanan
const loading = ref(true)

// Format tanggal (contoh: 12 Jan 2024)
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

// Format Rupiah
const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

// Fetch Data User & Pesanan
const fetchData = async () => {
  try {
    const token = await auth.currentUser.getIdToken()
    const headers = { Authorization: `Bearer ${token}` }

    // 1. Ambil Profil
    const userRes = await axios.get('http://localhost:3000/auth/me', { headers })
    user.value = userRes.data

    // 2. Ambil Riwayat Pesanan (RFQ)
    const orderRes = await axios.get('http://localhost:3000/rfq/my-history', { headers })
    orders.value = orderRes.data

  } catch (error) {
    console.error("Gagal ambil data:", error)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await auth.signOut()
  localStorage.removeItem('token')
  localStorage.removeItem('user_role')
  router.push('/Sign_In')
}

onMounted(() => {
  setTimeout(() => {
    if (auth.currentUser) {
      fetchData()
    } else {
      router.push('/Sign_In')
    }
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans pb-20">
    <Navbar />

    <div class="pt-28 px-4 sm:px-6 max-w-6xl mx-auto">

      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-2xl font-bold text-gray-800">Dashboard Akun</h1>
           <p class="text-gray-500 text-sm">Kelola profil dan pantau status pesanan Anda.</p>
        </div>
        <button
          @click="handleLogout"
          class="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition flex items-center gap-2 self-start md:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Keluar
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-400">
                   <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                </div>
                <div>
                   <h2 class="font-bold text-gray-800">{{ user?.name || 'User' }}</h2>
                   <p class="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block mt-1">
                      Member
                   </p>
                </div>
             </div>

             <div class="space-y-4">
                <div>
                   <label class="text-xs text-gray-400 uppercase font-bold">Email</label>
                   <p class="text-sm font-medium text-gray-700 truncate">{{ user?.email }}</p>
                </div>
                <div>
                   <label class="text-xs text-gray-400 uppercase font-bold">Telepon</label>
                   <p class="text-sm font-medium text-gray-700">{{ user?.phone || '-' }}</p>
                </div>
                <div>
                   <label class="text-xs text-gray-400 uppercase font-bold">Alamat</label>
                   <p class="text-sm font-medium text-gray-700">{{ user?.address || '-' }}</p>
                </div>
             </div>
          </div>
        </div>

        <div class="lg:col-span-2">
           <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              📦 Riwayat Permintaan (RFQ)
           </h3>

           <div v-if="orders.length === 0" class="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p class="text-gray-500">Belum ada riwayat permintaan penawaran.</p>
              <router-link to="/Produk" class="text-green-600 font-medium hover:underline text-sm mt-2 inline-block">Cari Produk</router-link>
           </div>

           <div v-else class="space-y-4">
              <div v-for="item in orders" :key="item.id" class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition">
                 <div class="flex flex-col sm:flex-row gap-4">
                    <img
                      :src="item.image_url ? `http://localhost:3000/uploads/${item.image_url}` : 'https://via.placeholder.com/100'"
                      class="w-20 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100"
                    />

                    <div class="flex-1">
                       <div class="flex justify-between items-start">
                          <div>
                             <h4 class="font-bold text-gray-800">{{ item.product_name }}</h4>
                             <p class="text-xs text-gray-500">ID Req: #RFQ-{{ item.id }} • {{ formatDate(item.created_at) }}</p>
                             <p class="text-sm text-gray-600 mt-1">Qty: {{ item.quantity }} Unit • RS: {{ item.hospital_name }}</p>
                          </div>

                          <span :class="{
                             'bg-yellow-100 text-yellow-700': item.status === 'pending',
                             'bg-blue-100 text-blue-700': item.status === 'reviewing',
                             'bg-green-100 text-green-700': item.status === 'quotation_sent',
                             'bg-red-100 text-red-700': item.status === 'rejected'
                          }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                             {{ item.status.replace('_', ' ') }}
                          </span>
                       </div>

                       <div v-if="item.status === 'quotation_sent'" class="mt-3 pt-3 border-t border-gray-50 bg-green-50/50 -mx-5 px-5 -mb-5 pb-5 rounded-b-xl">
                          <div class="flex justify-between items-center">
                             <div>
                                <p class="text-xs text-gray-500">Penawaran dari Admin:</p>
                                <p class="text-lg font-bold text-green-700">{{ formatRupiah(item.price_quote) }}</p>
                             </div>
                             <button class="text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition">
                                Download Invoice
                             </button>
                          </div>
                          <p v-if="item.admin_notes" class="text-xs text-gray-500 mt-2">
                             <span class="font-bold">Catatan:</span> {{ item.admin_notes }}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  </div>
</template>
