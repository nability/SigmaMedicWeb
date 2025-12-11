<template>
  <div class="flex flex-col min-h-screen bg-[#F7FAF8]">
    <Navbar />


    <!-- 🩺 Section Kontak -->
    <section class="px-8 md:px-16 lg:px-24 pt-25 py-20 bg-[#E7F2E5] rounded-b-[3rem]">
      <!-- Judul -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hubungi Kami</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Sigma Medic siap membantu kebutuhan alat medis dan layanan kesehatan Anda. Silakan isi
          formulir berikut untuk menghubungi kami.
        </p>
      </div>

      <!-- Isi: Gambar & Form -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-10">
        <!-- Gambar kiri -->
        <div class="w-full md:w-1/2">
          <img
            src="@/assets/hero-medis.jpg"
            alt="Kontak Sigma Medic"
            class="rounded-3xl shadow-md object-cover w-full h-[400px]"
          />
        </div>

        <!-- Form kanan -->
        <div class="w-full md:w-1/2 bg-[#CFE3C6] p-8 rounded-3xl shadow-md">
          <form class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                placeholder="Masukkan nama anda"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="Masukkan email anda"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Masukkan password anda"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
              <textarea
                rows="4"
                placeholder="Tulis pesan anda..."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              ></textarea>
            </div>

            <button
              type="submit"
              class="bg-[#69BD79] hover:bg-[#58a86a] text-white font-medium px-6 py-2 rounded-lg shadow transition"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>
