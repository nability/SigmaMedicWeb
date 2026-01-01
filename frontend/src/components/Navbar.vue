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
const menuOpen = ref(false) // State untuk mobile menu
const userName = ref('User')
const userPhoto = ref(null)

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
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      userName.value = user.displayName || user.email.split('@')[0]
      userPhoto.value = user.photoURL

      const role = localStorage.getItem('user_role')
      isAdmin.value = (role === 'admin')
    } else {
      isLoggedIn.value = false
      isAdmin.value = false
    }
  })
})
</script>

<template>
  <nav class="bg-white shadow-md fixed w-full z-50 top-0 left-0">
    <div class="flex justify-between px-6 py-3 items-center">

      <router-link to="/" class="flex items-center gap-2 font-bold text-lg text-[#5B8A62]">
        <img :src="logoSigma" class="w-8 h-8"/> Sigma Medic
      </router-link>

      <div class="hidden md:flex gap-6 text-gray-600 font-medium">
         <router-link to="/" active-class="text-green-600 font-bold">Beranda</router-link>
         <router-link to="/tentang-kami" active-class="text-green-600 font-bold">Tentang Kami</router-link>
         <router-link to="/Produk" active-class="text-green-600 font-bold">Produk</router-link>
         <router-link to="/Kontak" active-class="text-green-600 font-bold">Kontak</router-link>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="isLoggedIn">
           <div class="relative">
             <button @click="toggleDropdown" class="flex items-center gap-3 focus:outline-none">
               <div class="text-right hidden md:block">
                 <p class="text-sm font-semibold text-gray-700">{{ userName }}</p>
                 <span v-if="isAdmin" class="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wider">ADMIN</span>
               </div>
               <img :src="userPhoto || 'https://ui-avatars.com/api/?name='+userName" class="w-9 h-9 rounded-full border border-gray-300"/>
             </button>

             <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 border z-50">
               <div class="px-4 py-2 border-b md:hidden">
                 <p class="text-sm font-semibold">{{ userName }}</p>
               </div>

               <router-link v-if="isAdmin" to="/admin" @click="dropdownOpen=false" class="block px-4 py-2 text-purple-700 font-bold hover:bg-purple-50 border-b">
                 ⚙️ Admin Panel
               </router-link>

               <router-link to="/akun" @click="dropdownOpen=false" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard Akun</router-link>
               <div class="border-t my-1"></div>
               <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
             </div>

             <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-40 cursor-default"></div>
           </div>
        </template>

        <template v-else>
           <router-link to="/Sign_In" class="hidden md:block bg-[#5B8A62] text-white px-5 py-2 rounded-full font-medium shadow hover:shadow-lg transition">Login</router-link>
        </template>

        <button @click="menuOpen = !menuOpen" class="md:hidden text-gray-700 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </div>

    <div v-if="menuOpen" class="md:hidden bg-white border-t px-4 py-2 shadow-lg">
      <router-link to="/" class="block py-2 text-gray-600">Beranda</router-link>
      <router-link to="/tentang-kami" class="block py-2 text-gray-600">Tentang Kami</router-link>
      <router-link to="/Produk" class="block py-2 text-gray-600">Produk</router-link>
      <router-link to="/Kontak" class="block py-2 text-gray-600">Kontak</router-link>
      <div v-if="!isLoggedIn" class="mt-2 pt-2 border-t">
        <router-link to="/Sign_In" class="block py-2 text-[#5B8A62] font-bold">Login / Daftar</router-link>
      </div>
    </div>
  </nav>
</template>
