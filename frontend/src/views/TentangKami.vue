<template>
  <div class="min-h-screen flex flex-col bg-[#F8FBF7] overflow-x-hidden">
    <!-- ✅ Navbar -->
    <Navbar />

    <!-- ✅ Main Content -->
    <main class="flex-grow pt-24 pb-20 px-6 lg:px-24 ">
      <!-- 🏢 Profil Perusahaan -->
      <section
        ref="profilSection"
        class="bg-[#EAF5E7] rounded-2xl p-6 lg:p-10 flex flex-col lg:flex-row items-center lg:items-center gap-8 shadow-md opacity-0 translate-y-12 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="{ 'opacity-100 translate-y-0': profilVisible }"
      >
        <!-- 🖼️ Gambar kiri -->
        <div
          class="w-full lg:w-1/3 flex justify-center opacity-0 translate-y-8 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="{ 'opacity-100 translate-y-0': profilVisible }"
        >
          <img
            src="@/assets/profil-team.jpg"
            alt="Tim Sigma Medic"
            class="rounded-xl object-cover shadow-md w-full max-w-sm lg:max-w-none"
          />  
        </div>

        <!-- 🧾 Teks kanan -->
        <div class="flex-1 flex flex-col justify-center">
          <h2
            class="text-2xl font-semibold mb-5 text-gray-800 opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="{ 'opacity-100 translate-y-0': profilVisible }"
          >
            PT. SIGMA MEDIC
          </h2>

          <!-- ✨ Paragraf muncul satu-satu (slide-up & fade-in) -->
          <p
            v-for="(para, index) in paragraphs"
            :key="index"
            class="text-gray-700 text-justify leading-relaxed opacity-0 translate-y-10 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] mb-6"
            :style="{ transitionDelay: `${0.3 + index * 0.3}s` }"
            :class="{ 'opacity-100 translate-y-0': profilVisible }"
          >
            {{ para }}
          </p>
        </div>
      </section>

      <!-- 🌱 Visi & Misi -->
      <section
        ref="visiMisiSection"
        class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-0 translate-y-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="{ 'opacity-100 translate-y-0': visiMisiVisible }"
      >
        <!-- VISI -->
        <div
          class="bg-[#EAF5E7] rounded-2xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-500 opacity-0 translate-y-8 ease-[cubic-bezier(0.22,1,0.36,1)]"
          :style="{ transitionDelay: visiMisiVisible ? '0.2s' : '0s' }"
          :class="{ 'opacity-100 translate-y-0': visiMisiVisible }"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">VISI PERUSAHAAN</h3>
          <p class="text-gray-700 leading-relaxed">
            Menjadi perusahaan teknologi kesehatan terpercaya yang menghadirkan inovasi digital dan
            produk alat medis berkualitas tinggi untuk mendukung peningkatan layanan kesehatan di
            Indonesia.
          </p>
        </div>

        <!-- MISI -->
        <div
          class="bg-[#EAF5E7] rounded-2xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-500 opacity-0 translate-y-8 ease-[cubic-bezier(0.22,1,0.36,1)]"
          :style="{ transitionDelay: visiMisiVisible ? '0.10s' : '0s' }"
          :class="{ 'opacity-100 translate-y-0': visiMisiVisible }"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">MISI PERUSAHAAN</h3>
          <ul class="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed marker:text-[rgb(0,0,0)]">
            <li>
              Mengembangkan sistem digital terpadu untuk mempermudah proses pengadaan alat
              kesehatan.
            </li>
            <li>
              Menyediakan alat kesehatan berkualitas sesuai standar nasional dan internasional.
            </li>
            <li>
              Membangun hubungan kemitraan jangka panjang dengan rumah sakit, klinik, dan tenaga
              kesehatan.
            </li>
            <li>Memberikan pelayanan yang profesional dan berintegritas tinggi.</li>
          </ul>
        </div>
      </section>
    </main>

    <!-- ✅ Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

// animasi tampil section
const profilVisible = ref(false)
const visiMisiVisible = ref(false)

// ✅ buat ref untuk elemen DOM
const visiMisiSection = ref(null)

// isi paragraf dipecah biar bisa animasi satu-satu
const paragraphs = [
  'PT Sigma Medic adalah perusahaan teknologi dan manufaktur yang bergerak di bidang pengembangan sistem digital dan produksi alat kesehatan. Kami berfokus pada penciptaan solusi berbasis teknologi yang mempermudah proses pengadaan alat kesehatan antara perusahaan dan rumah sakit, melalui platform digital yang aman, efisien, dan transparan.',
  'Website Sigma Medic dikembangkan dengan model bisnis Business to Business (B2B), yang memungkinkan rumah sakit untuk melihat katalog produk, mengajukan permintaan penawaran harga (Request for Quotation / RFQ), serta melakukan proses validasi resmi untuk memastikan transaksi hanya dilakukan oleh institusi kesehatan yang terverifikasi.',
  'Selain sebagai pengembang perangkat lunak, PT Sigma Medic juga memproduksi alat-alat kesehatan yang telah memenuhi standar kualitas nasional dan internasional, seperti alat diagnostik, peralatan terapi, serta bahan medis habis pakai. Dengan memadukan teknologi modern, sistem otomatisasi, dan keamanan data digital, Sigma Medic berkomitmen untuk mendukung transformasi digital dalam industri kesehatan Indonesia, serta membangun kepercayaan antara produsen dan penyedia layanan medis.'
]

// observer untuk animasi on scroll
const observeVisibility = (target, callback) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) callback(true)
      })
    },
    { threshold: 0.2 }
  )
  observer.observe(target)
}

onMounted(() => {
  // delay awal untuk animasi profil
  setTimeout(() => {
    profilVisible.value = true
  }, 200)

  // ✅ gunakan ref Vue, bukan querySelector
  if (visiMisiSection.value) {
    observeVisibility(visiMisiSection.value, (v) => (visiMisiVisible.value = v))
  }
})
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
