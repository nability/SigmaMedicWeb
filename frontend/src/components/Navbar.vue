<template>
  <nav
    class="bg-[#A5C79B] text-sm w-full fixed top-0 left-0 z-50 transition-all duration-500"
    :class="{ 'opacity-100 translate-y-0': navbarVisible }"
  >
    <div class="hidden md:flex justify-center items-center px-6 py-2 text-white text-center bg-[#8FB584]">
      <div class="flex items-center gap-2">
        <span>📧 contact@sigmamedic.com</span>
        <span>| ☎ Tel: 888.688.6822</span>
      </div>
    </div>

    <div class="bg-white flex items-center justify-between px-6 md:px-10 py-3 shadow-md relative">

      <router-link to="/" class="flex items-center gap-2 group">
        <img :src="logoSigma" class="w-10 h-10 object-contain group-hover:scale-105 transition" />
        <span class="font-bold text-lg text-[#5B8A62]">Sigma Medic</span>
      </router-link>

      <ul class="hidden md:flex items-center gap-8 font-medium text-gray-600">
        <li><router-link to="/" active-class="text-green-600 font-bold">Beranda</router-link></li>
        <li><router-link to="/tentang-kami" active-class="text-green-600 font-bold">Tentang Kami</router-link></li>
        <li><router-link to="/Produk" active-class="text-green-600 font-bold">Produk</router-link></li>
        <li><router-link to="/Kontak" active-class="text-green-600 font-bold">Kontak</router-link></li>
      </ul>

      <div class="flex items-center gap-4">

        <div v-if="isLoggedIn" class="relative">
          <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none">
            <span class="hidden md:block text-gray-700 font-medium text-sm text-right">
              Halo, {{ userName }}
            </span>
            <img
              :src="userPhoto || 'https://ui-avatars.com/api/?name=' + userName + '&background=random'"
              class="w-9 h-9 rounded-full border border-gray-300 shadow-sm hover:ring-2 hover:ring-green-400 transition"
            />
          </button>

          <div v-if="dropdownOpen" class="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
            <div class="px-4 py-2 border-b border-gray-100 md:hidden">
              <p class="text-xs text-gray-500">Login sebagai</p>
              <p class="font-semibold text-gray-800 truncate">{{ userName }}</p>
            </div>

            <router-link
              to="/akun"
              @click="dropdownOpen = false"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
            >
              Dashboard Saya
            </router-link>

            <div class="border-t border-gray-100 my-1"></div>

            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>

          <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-40 cursor-default"></div>
        </div>

        <template v-else>
          <router-link
            to="/Sign_In"
            class="hidden md:block bg-[#5B8A62] text-white px-5 py-2 rounded-full font-medium hover:bg-[#4a7550] transition shadow-md hover:shadow-lg"
          >
            Login / Daftar
          </router-link>
          <button @click="menuOpen = !menuOpen" class="md:hidden">
             <svg class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </template>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import logoSigma from '@/assets/Logo.png'

const router = useRouter()
const navbarVisible = ref(false)
const isLoggedIn = ref(false)
const dropdownOpen = ref(false)
const menuOpen = ref(false)

// State data user sederhana untuk Navbar
const userName = ref('User')
const userPhoto = ref(null)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = async () => {
  dropdownOpen.value = false
  await signOut(auth)
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/Sign_In')
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      // Ambil nama depan saja biar tidak kepanjangan di navbar
      userName.value = user.displayName || user.email.split('@')[0]
      userPhoto.value = user.photoURL
    } else {
      isLoggedIn.value = false
    }
  })

  setTimeout(() => navbarVisible.value = true, 100)
})
</script>
