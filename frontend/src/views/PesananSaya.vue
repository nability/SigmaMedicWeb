<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const loading = ref(true)
const rawOrders = ref([])
const activeTab = ref('all')

// Definisi Tab Status (Mapping status Database ke Tampilan User)
const tabs = [
  { id: 'all', label: 'Semua' },
  { id: 'pending', label: 'Menunggu' },
  { id: 'reviewing', label: 'Diproses' },
  { id: 'quotation_sent', label: 'Penawaran Masuk' },
  { id: 'rejected', label: 'Dibatalkan' }
]

// Fetch Data
const fetchOrders = async () => {
  try {
    const token = await auth.currentUser.getIdToken()
    const res = await axios.get('http://localhost:3000/rfq/my-history', {
      headers: { Authorization: `Bearer ${token}` }
    })
    rawOrders.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Filter Logic (Computed)
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return rawOrders.value
  return rawOrders.value.filter(order => order.status === activeTab.value)
})

// Format Rupiah
const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)
const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

onMounted(() => {
  setTimeout(() => {
    if (auth.currentUser) fetchOrders()
    else router.push('/Sign_In')
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-[#F7FAF8] font-sans flex flex-col">
    <Navbar />

    <div class="pt-24 pb-20 flex-1">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">

        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">Pesanan Saya</h1>
            <router-link to="/Produk" class="text-sm font-medium text-[#5B8A62] hover:underline">
                + Buat Pesanan Baru
            </router-link>
        </div>

        <div class="bg-white rounded-t-lg shadow-sm border-b border-gray-100 sticky top-20 z-30 overflow-x-auto no-scrollbar">
          <div class="flex min-w-max">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative px-6 py-4 text-sm font-medium transition-all duration-300 outline-none"
              :class="activeTab === tab.id ? 'text-[#5B8A62]' : 'text-gray-500 hover:text-[#5B8A62]'"
            >
              {{ tab.label }}
              <span
                class="absolute bottom-0 left-0 h-[3px] bg-[#5B8A62] transition-all duration-300 w-full transform origin-center"
                :class="activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'"
              ></span>
            </button>
          </div>
        </div>

        <div class="mt-4 min-h-[400px]">

          <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
             <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5B8A62]"></div>
             <p class="text-gray-400 text-sm animate-pulse">Memuat pesanan...</p>
          </div>

          <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
             <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" class="w-32 h-32 opacity-20 mb-4 grayscale" />
             <p class="text-gray-500 font-medium">Belum ada pesanan di tab ini.</p>
          </div>

          <TransitionGroup
            name="list"
            tag="div"
            class="space-y-4"
          >
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="bg-white rounded-lg shadow-sm p-5 border border-transparent hover:border-[#5B8A62] hover:shadow-md transition-all duration-300 group"
            >

              <div class="flex justify-between items-center border-b border-gray-50 pb-3 mb-3">
                 <div class="flex items-center gap-2">
                    <span class="bg-[#5B8A62] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Mall</span>
                    <span class="font-bold text-gray-700 text-sm">Sigma Medic Official</span>
                 </div>
                 <div class="text-sm font-semibold uppercase tracking-wide"
                    :class="{
                        'text-orange-500': order.status === 'pending',
                        'text-blue-500': order.status === 'reviewing',
                        'text-[#5B8A62]': order.status === 'quotation_sent',
                        'text-red-500': order.status === 'rejected'
                    }"
                 >
                    {{ order.status.replace('_', ' ') }}
                 </div>
              </div>

              <div class="flex gap-4">
                 <img
                   :src="order.image_url ? `http://localhost:3000/uploads/${order.image_url}` : 'https://via.placeholder.com/150'"
                   class="w-20 h-20 object-cover rounded bg-gray-50"
                 />
                 <div class="flex-1">
                    <h3 class="text-gray-800 font-medium line-clamp-2 leading-snug">{{ order.product_name }}</h3>
                    <p class="text-gray-500 text-xs mt-1">Variasi: Standar</p>
                    <div class="flex justify-between items-end mt-2">
                       <p class="text-gray-500 text-sm">x{{ order.quantity }}</p>
                       <p v-if="order.price_quote > 0" class="text-[#5B8A62] font-bold">
                          {{ formatRupiah(order.price_quote) }}
                       </p>
                       <p v-else class="text-gray-400 text-xs italic">Menunggu Harga</p>
                    </div>
                 </div>
              </div>

              <div class="border-t border-gray-50 pt-4 mt-4 flex flex-col sm:flex-row justify-end items-center gap-4">

                 <div v-if="order.price_quote > 0" class="flex items-center gap-2">
                    <span class="text-sm text-gray-600">Total Pesanan:</span>
                    <span class="text-lg font-bold text-[#5B8A62]">{{ formatRupiah(order.price_quote) }}</span>
                 </div>

                 <div class="flex gap-2 w-full sm:w-auto">
                    <button class="flex-1 sm:flex-none border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
                       Hubungi Penjual
                    </button>

                    <button
                        v-if="order.status === 'quotation_sent'"
                        class="flex-1 sm:flex-none bg-[#5B8A62] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#4a7550] shadow-sm hover:shadow transition"
                    >
                       Terima Penawaran
                    </button>

                    <button
                        v-else
                        class="flex-1 sm:flex-none bg-[#5B8A62] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#4a7550] shadow-sm hover:shadow transition opacity-80"
                    >
                       Lihat Rincian
                    </button>
                 </div>
              </div>

            </div>
          </TransitionGroup>

        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
/* ANIMASI LIST VUE (Flip Move) */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.list-leave-active {
  position: absolute;
  width: 100%; /* Penting agar layout tidak hancur saat item keluar */
}

/* Hide Scrollbar tapi tetap bisa scroll */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
