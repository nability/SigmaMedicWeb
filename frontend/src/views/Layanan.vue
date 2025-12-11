<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="bg-[#8CAF7C] text-white text-center py-34 px-6 pb-20">
      <h1 class="text-5xl font-bold mb-4">Layanan Kami</h1>
      <p class="text-lg max-w-2xl mx-auto">
        Sigma Medic menghadirkan layanan terbaik dalam bidang teknologi medis untuk rumah sakit dan
        klinik di seluruh Indonesia.
      </p>
    </section>

    <!-- Daftar Layanan -->
    <section class="flex-1 bg-white py-16 px-6 md:px-20">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Solusi Kesehatan Modern</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <!-- Card 1 -->
        <div
          class="bg-[#F7FAF8] rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <img
            src="@/assets/service1.jpg"
            alt="Kalibrasi Peralatan Medis"
            class="w-24 h-24 mb-4 object-cover rounded-full border border-[#69BD79]"
          />
          <h3 class="text-xl font-semibold mb-2 text-[#69BD79]">Kalibrasi Peralatan Medis</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Layanan profesional untuk menjaga akurasi dan performa alat medis Anda dengan standar
            nasional & internasional.
          </p>
        </div>

        <!-- Card 2 -->
        <div
          class="bg-[#F7FAF8] rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <img
            src="@/assets/service2.jpg"
            alt="Instalasi & Pemeliharaan"
            class="w-24 h-24 mb-4 object-cover rounded-full border border-[#69BD79]"
          />
          <h3 class="text-xl font-semibold mb-2 text-[#69BD79]">Instalasi & Pemeliharaan</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Tim teknisi ahli kami siap membantu pemasangan dan perawatan alat kesehatan agar selalu
            optimal.
          </p>
        </div>

        <!-- Card 3 -->
        <div
          class="bg-[#F7FAF8] rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <img
            src="@/assets/service3.jpg"
            alt="Pelatihan Penggunaan Alat"
            class="w-24 h-24 mb-4 object-cover rounded-full border border-[#69BD79]"
          />
          <h3 class="text-xl font-semibold mb-2 text-[#69BD79]">Pelatihan Penggunaan Alat</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Edukasi tenaga medis untuk memahami pengoperasian dan perawatan alat kesehatan dengan
            efektif.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-[#69BD79] text-white py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Butuh Konsultasi Layanan?</h2>
      <p class="text-lg mb-6">
        Hubungi tim kami untuk solusi terbaik sesuai kebutuhan rumah sakit Anda.
      </p>
      <a
        href="/kontak"
        class="bg-white text-[#69BD79] px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
      >
        Hubungi Kami
      </a>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>
