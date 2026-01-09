<template>
  <div class="flex flex-col min-h-screen bg-[#F7FAF8]">
    <Navbar />

    <section class="px-8 md:px-16 lg:px-24 pt-25 py-20 bg-[#E7F2E5] rounded-b-[3rem]">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hubungi Kami</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Sigma Medic siap membantu kebutuhan alat medis dan layanan kesehatan Anda. Silakan isi
          formulir berikut untuk menghubungi kami.
        </p>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="w-full md:w-1/2">
          <img
            src="@/assets/hero-medis.jpg"
            alt="Kontak Sigma Medic"
            class="rounded-3xl shadow-md object-cover w-full h-[450px]"
          />
        </div>

        <div class="w-full md:w-1/2 bg-[#CFE3C6] p-8 rounded-3xl shadow-md">
          <form @submit.prevent="submitContact" class="space-y-5">

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Masukkan nama anda"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="Masukkan email anda"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
              <input
                v-model="form.subject"
                type="text"
                placeholder="Topik pesan (Misal: Tanya Stok)"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="Tulis pesan anda..."
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#69BD79]"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#69BD79] hover:bg-[#58a86a] text-white font-medium px-6 py-2 rounded-lg shadow transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Mengirim...</span>
              <span v-else>Kirim Pesan</span>
            </button>

          </form>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

// State Form
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)

// Fungsi Kirim Pesan
const submitContact = async () => {
  loading.value = true
  try {
    // Sesuaikan URL dengan backend Anda
    await axios.post('http://localhost:3000/contact', form.value)

    alert('Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.')

    // Reset Form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    console.error(error)
    alert('Gagal mengirim pesan. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}
</script>
