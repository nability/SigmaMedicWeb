<template>
  <div class="flex flex-col min-h-screen bg-[#F7FAF8] overflow-x-hidden">
    <Navbar />

    <section
      ref="heroSection"
      class="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-30 lg:px-30 py-45 bg-[#E7F2E5] transition-all duration-700 ease-in-out"
      :style="{ backgroundPositionY: parallaxOffset + 'px' }"
    >
      <div
        class="max-w-xl space-y-6 text-center md:text-left opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
      >
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Solusi medis <br />
          terdepan untuk kebutuhan <br />
          kesehatan anda
        </h1>
        <p class="text-gray-600">
          Sigma Medic menyediakan peralatan medis berkualitas tinggi untuk mendukung pelayanan
          kesehatan. Kami berkomitmen memberikan teknologi terbaik yang modern, responsif,
          diagnosis, dan perawatan pasien.
        </p>
        <div class="flex justify-center md:justify-start gap-4">
          <router-link
            to="/Profile"
            class="bg-[#69BD79] hover:bg-[#58a86a] text-white px-6 py-2 rounded-full shadow transition"
          >
            Selengkapnya
          </router-link>
          <router-link
            to="/Kontak"
            class="border border-[#69BD79] text-[#69BD79] px-6 py-2 rounded-full hover:bg-[#69BD79] hover:text-white transition"
          >
            Kontak
          </router-link>
        </div>
      </div>

      <div
        class="mt-10 md:mt-0 md:w-[45%] opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
      >
        <img
          src="@/assets/hero-medis.jpg"
          alt="Solusi Medis"
          class="rounded-3xl shadow-md object-cover w-full h-[350px] md:h-[420px]"
        />
      </div>
    </section>

    <section class="px-8 md:px-16 lg:px-24 py-20 bg-white">
      <div
        class="text-center mb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
      >
        <p class="text-sm uppercase tracking-widest text-[#69BD79]">Produk</p>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Produk Unggulan Sigma Medic</h2>
        <p class="text-gray-600 mt-2">
          Teknologi canggih untuk mendukung diagnosis dan perawatan pasien
        </p>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-40">
         <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-green-600"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(item, index) in products"
          :key="item.id"
          class="bg-[#F7FAF8] rounded-2xl shadow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
        >
          <img
            :src="item.image_url ? `http://localhost:3000/uploads/${item.image_url}` : 'https://via.placeholder.com/300?text=No+Image'"
            :alt="item.name"
            class="w-full h-56 object-cover"
          />

          <div class="p-6 flex flex-col flex-1">
            <h3 class="text-lg font-semibold mb-2">{{ item.name }}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ item.description }}</p>

            <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
              <span class="text-[#5B8A62] font-bold text-sm">
                 Rp {{ item.price.toLocaleString('id-ID') }}
              </span>

              <router-link
                to="/Produk"
                class="text-white bg-[#69BD79] px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#58a86a] transition shadow-sm"
              >
                Lihat Detail
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
          <router-link
            to="/Produk"
            class="inline-block border border-[#69BD79] text-[#69BD79] px-8 py-3 rounded-full hover:bg-[#69BD79] hover:text-white transition font-medium"
          >
            Lihat Semua Produk
          </router-link>
      </div>
    </section>

    <section class="bg-[#E7F2E5] py-39 px-8 md:px-16 lg:px-12 rounded-t-[3rem]">
      <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">Testimoni Pelanggan</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(testi, idx) in testimonials"
          :key="idx"
          class="bg-white rounded-2xl shadow p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <p class="text-gray-600 mb-4">"{{ testi.quote }}"</p>
          <p class="font-semibold text-[#69BD79]">{{ testi.name }}</p>
          <p class="text-sm text-gray-500">{{ testi.title }}</p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios' // Import Axios
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const isVisible = ref(false)
const parallaxOffset = ref(0)
const products = ref([]) // State untuk menyimpan data produk
const loading = ref(true)

// Parallax scrolling
const handleScroll = () => {
  parallaxOffset.value = window.scrollY * 0.4
}

// Fetch Produk dari Backend
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products')
    // Ambil 3 produk pertama saja untuk ditampilkan di Beranda
    products.value = response.data.slice(0, 3)
  } catch (error) {
    console.error("Gagal mengambil produk:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Trigger fade-in animation
  setTimeout(() => {
    isVisible.value = true
  }, 200)

  // Load Data
  fetchProducts()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Testimoni dummy (tetap statis)
const testimonials = [
  { quote: 'Pelayanan sangat membantu meningkatkan akurasi diagnosis dan perawatan pasien.', name: 'Dr. Erika', title: 'Dokter Rumah Sakit Jakarta' },
  { quote: 'Kualitas produk luar biasa dan desain ergonomis, sangat membantu di lapangan.', name: 'Budi', title: 'Kepala Laboratorium' },
  { quote: 'Sigma Medic memberikan solusi lengkap untuk kebutuhan alat medis rumah sakit kami.', name: 'Dr. Rahmat', title: 'Pemilik Klinik Sehat' }
]
</script>
