<template>
  <div class="flex flex-col min-h-screen bg-[#F7FAF8] overflow-x-hidden">
    <!-- ✅ Navbar -->
    <Navbar />

    <!-- 🩺 Hero Section dengan Parallax -->
    <section
      ref="heroSection"
      class="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-30 lg:px-30 py-45 bg-[#E7F2E5] transition-all duration-700 ease-in-out"
      :style="{ backgroundPositionY: parallaxOffset + 'px' }"
    >
      <!-- Fade-in animasi -->
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
            to="/kontak"
            class="border border-[#69BD79] text-[#69BD79] px-6 py-2 rounded-full hover:bg-[#69BD79] hover:text-white transition"
          >
            Kontak
          </router-link>
        </div>
      </div>

      <!-- Gambar kanan -->
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

    <!-- 🏥 Produk Unggulan -->
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

      <!-- Grid produk -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card template -->
        <div
          v-for="(item, index) in products"
          :key="index"
          class="bg-[#F7FAF8] rounded-2xl shadow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
        >
          <img :src="item.image" :alt="item.title" class="w-full h-56 object-cover" />
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ item.desc }}</p>
            <div class="flex justify-between text-sm">
              <button class="text-[#69BD79] font-medium hover:underline">Lihat detail</button>
              <button class="text-[#69BD79] font-medium hover:underline">Katalog</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⭐ Testimoni -->
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
    <!-- ✅ Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const isVisible = ref(false)
const parallaxOffset = ref(0)

// Parallax scrolling
const handleScroll = () => {
  parallaxOffset.value = window.scrollY * 0.4
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Trigger fade-in animation
  setTimeout(() => {
    isVisible.value = true
  }, 200)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Produk dummy
const products = [
  {
    image: new URL('@/assets/icu-monitor.jpg', import.meta.url).href,
    title: 'ICU Monitor',
    desc: 'Menyajikan monitor ICU untuk diagnosis real-time pasien dengan teknologi akurat.'
  },
  {
    image: new URL('@/assets/kursi-roda.jpg', import.meta.url).href,
    title: 'Kursi Roda',
    desc: 'Ringkas, nyaman, dan tahan lama untuk penggunaan harian pasien.'
  },
  {
    image: new URL('@/assets/sarung-tangan.jpg', import.meta.url).href,
    title: 'Sarung Tangan Latex',
    desc: 'Sarung tangan steril dan anti bakteri untuk menjaga kebersihan tenaga medis.'
  }
]


// Testimoni dummy
const testimonials = [
  { quote: 'Pelayanan sangat membantu meningkatkan akurasi diagnosis dan perawatan pasien.', name: 'Dr. Erika', title: 'Dokter Rumah Sakit Jakarta' },
  { quote: 'Kualitas produk luar biasa dan desain ergonomis, sangat membantu di lapangan.', name: 'Budi', title: 'Kepala Laboratorium' },
  { quote: 'Sigma Medic memberikan solusi lengkap untuk kebutuhan alat medis rumah sakit kami.', name: 'Dr. Rahmat', title: 'Pemilik Klinik Sehat' }
]
</script>
