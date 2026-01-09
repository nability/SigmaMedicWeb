<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import logoSigma from '@/assets/Logo.png'

const router = useRouter()
const isLoggedIn = ref(false)
const isAdmin = ref(false)
const dropdownOpen = ref(false)
const menuOpen = ref(false)
const userName = ref('User')
const isNavVisible = ref(false) // State untuk animasi slide-in

const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value

const handleLogout = async () => {
  dropdownOpen.value = false
  await signOut(auth)
  localStorage.removeItem('token')
  localStorage.removeItem('user_role')
  isLoggedIn.value = false
  isAdmin.value = false
  router.push('/Sign_In')
}

onMounted(() => {
  // Cek Auth
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      userName.value = user.displayName || user.email.split('@')[0]
      const role = localStorage.getItem('user_role')
      isAdmin.value = (role === 'admin')
    } else {
      isLoggedIn.value = false
      isAdmin.value = false
    }
  })

  // Trigger Animasi Slide-In setelah component dimount
  setTimeout(() => {
    isNavVisible.value = true
  }, 100)
})
</script>

<template>
  <header
    class="fixed w-full z-50 top-0 left-0 font-sans shadow-md transition-all duration-700 ease-out transform"
    :class="isNavVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'"
  >

    <div class="hidden md:flex justify-center items-center px-6 py-2 text-white text-xs font-medium tracking-wide bg-[#8FB584]">
      <div class="flex items-center gap-4">
        <span>📧 contact@sigmamedic.com</span>
        <span>|</span>
        <span>☎ Tel: 888.688.6822</span>
      </div>
    </div>

    <nav class="flex justify-between px-6 py-3 items-center" style="background-color: #E7F2E5;">

      <router-link to="/" class="flex items-center gap-2 font-bold text-lg text-[#5B8A62] hover:opacity-80 transition">
        <img :src="logoSigma" class="w-9 h-9 object-contain"/>
        <span class="tracking-tight">Sigma Medic</span>
      </router-link>

      <div class="hidden md:flex gap-8 text-gray-600 font-medium text-sm uppercase tracking-wide">
         <router-link
            to="/"
            active-class="text-[#5B8A62] font-bold"
            class="relative group py-1 transition-colors duration-300 hover:text-[#5B8A62]"
         >
            Beranda
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5B8A62] transition-all duration-300 group-hover:w-full"></span>
         </router-link>

         <router-link
            to="/tentang-kami"
            active-class="text-[#5B8A62] font-bold"
            class="relative group py-1 transition-colors duration-300 hover:text-[#5B8A62]"
         >
            Tentang Kami
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5B8A62] transition-all duration-300 group-hover:w-full"></span>
         </router-link>

         <router-link
            to="/Produk"
            active-class="text-[#5B8A62] font-bold"
            class="relative group py-1 transition-colors duration-300 hover:text-[#5B8A62]"
         >
            Produk
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5B8A62] transition-all duration-300 group-hover:w-full"></span>
         </router-link>

         <router-link
            to="/Kontak"
            active-class="text-[#5B8A62] font-bold"
            class="relative group py-1 transition-colors duration-300 hover:text-[#5B8A62]"
         >
            Kontak
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5B8A62] transition-all duration-300 group-hover:w-full"></span>
         </router-link>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="isLoggedIn">
           <div class="relative">
             <button @click="toggleDropdown" class="flex items-center gap-3 focus:outline-none group">

               <div class="text-right hidden md:block">
                 <p class="text-xs font-bold text-gray-700 group-hover:text-[#5B8A62] transition uppercase">{{ userName }}</p>
                 <span v-if="isAdmin" class="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wider">ADMIN</span>
               </div>

               <div class="w-9 h-9 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-500 border border-[#5B8A62]/30 group-hover:bg-[#5B8A62] group-hover:text-white transition-all duration-300 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                  </svg>
               </div>

             </button>

             <div v-if="dropdownOpen" class="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-lg py-2 border border-gray-100 z-50 transform transition-all duration-200 origin-top-right">
               <div class="px-4 py-3 border-b border-gray-100 md:hidden bg-gray-50">
                 <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
                 <span v-if="isAdmin" class="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">ADMIN</span>
               </div>

               <router-link v-if="isAdmin" to="/admin" @click="dropdownOpen=false" class="flex items-center gap-2 px-4 py-2 text-purple-700 font-bold hover:bg-purple-50 transition text-sm">
                 <span>⚙️</span> Admin Panel
               </router-link>

               <router-link to="/akun" @click="dropdownOpen=false" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#E7F2E5] hover:text-[#5B8A62] transition text-sm">
                 <span>👤</span> Dashboard Akun
               </router-link>

               <router-link to="/pesanan-saya" @click="dropdownOpen=false" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#E7F2E5] hover:text-[#5B8A62] transition text-sm">
                  <span>📦</span> Pesanan Saya
               </router-link>

               <div class="border-t border-gray-100 my-1"></div>

               <button @click="handleLogout" class="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm">
                 <span>🚪</span> Logout
               </button>
             </div>

             <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-40 cursor-default"></div>
           </div>
        </template>

        <template v-else>
           <router-link to="/Sign_In" class="hidden md:block bg-[#5B8A62] text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#4a7550] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
             LOGIN
           </router-link>
        </template>

        <button @click="menuOpen = !menuOpen" class="md:hidden text-gray-700 focus:outline-none hover:text-[#5B8A62] transition">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </nav>

    <div v-if="menuOpen" class="md:hidden border-t border-gray-200 px-4 py-4 shadow-lg space-y-2" style="background-color: #E7F2E5;">
      <router-link to="/" class="block py-2 text-gray-600 hover:text-[#5B8A62] hover:bg-white/50 rounded px-2 transition font-medium">Beranda</router-link>
      <router-link to="/tentang-kami" class="block py-2 text-gray-600 hover:text-[#5B8A62] hover:bg-white/50 rounded px-2 transition font-medium">Tentang Kami</router-link>
      <router-link to="/Produk" class="block py-2 text-gray-600 hover:text-[#5B8A62] hover:bg-white/50 rounded px-2 transition font-medium">Produk</router-link>
      <router-link to="/Kontak" class="block py-2 text-gray-600 hover:text-[#5B8A62] hover:bg-white/50 rounded px-2 transition font-medium">Kontak</router-link>

      <div v-if="!isLoggedIn" class="mt-4 pt-4 border-t border-gray-300">
        <router-link to="/Sign_In" class="block w-full text-center bg-[#5B8A62] text-white py-2 rounded-lg font-bold shadow hover:bg-[#4a7550] transition">
          LOGIN / DAFTAR
        </router-link>
      </div>
    </div>
  </header>
</template>
