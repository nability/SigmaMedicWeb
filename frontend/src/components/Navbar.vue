<template>
  <nav
    class="bg-[#A5C79B] text-sm w-full fixed top-0 left-0 z-50 opacity-0 -translate-y-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
    :class="{ 'opacity-100 translate-y-0': navbarVisible }"
  >
    <!-- Top bar -->
    <div class="flex justify-center items-center px-6 py-2 text-white text-center">
      <div class="flex items-center gap-2 flex-wrap justify-center">
        <span>📧 contact@sigmamedic.com</span>
        <span>| ☎ Tel: 888.688.6822</span>
      </div>
    </div>

    <!-- Main Navbar -->
    <div class="bg-white flex items-center justify-between px-6 md:px-10 py-3 shadow-sm relative">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-[4px] group">
        <img
          :src="logoSigma"
          class="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
        />
        <span class="font-bold text-lg tracking-tight" :style="{ color: logoColor }">
          Sigma&nbsp;Medic
        </span>
      </router-link>

      <!-- Hamburger -->
      <button @click="menuOpen = !menuOpen" class="md:hidden">
        <svg v-if="!menuOpen" class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor">
          <path stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor">
          <path stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center gap-8 font-medium">
        <li><router-link to="/" class="nav-item" :class="active('/')">Beranda</router-link></li>
        <li><router-link to="/Profile" class="nav-item" :class="active('/Profile')">Profile</router-link></li>
        <li><router-link to="/Produk" class="nav-item" :class="active('/Produk')">Produk</router-link></li>
        <li><router-link to="/kontak" class="nav-item" :class="active('/kontak')">Kontak</router-link></li>
      </ul>

      <!-- RIGHT SIDE BUTTON -->
      <div class="hidden md:flex items-center gap-4">

        <!-- Jika sudah login -->
        <template v-if="isLoggedIn">
          <router-link
            to="/Profile"
            class="text-[#5B8A62] font-medium hover:underline"
          >
            Profile
          </router-link>

          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </template>

        <!-- Jika belum login -->
        <template v-else>
          <router-link
            :to="buttonLink"
            class="bg-[#A5C79B] text-white px-5 py-2 rounded-full shadow hover:shadow-lg transition"
          >
            {{ buttonText }}
          </router-link>
        </template>

      </div>

    </div> <!-- END MAIN NAVBAR -->

    <!-- Mobile Dropdown -->
    <transition name="slide">
      <div
        v-if="menuOpen"
        class="md:hidden bg-white shadow-lg flex flex-col items-center gap-4 py-4 border-t border-gray-200"
      >
        <router-link to="/" class="hover:text-green-600" @click="closeMenu">Beranda</router-link>
        <router-link to="/Profile" class="hover:text-green-600" @click="closeMenu">Profile</router-link>
        <router-link to="/Produk" class="hover:text-green-600" @click="closeMenu">Produk</router-link>
        <router-link to="/kontak" class="hover:text-green-600" @click="closeMenu">Kontak</router-link>

        <!-- logged in -->
        <div v-if="isLoggedIn" class="flex flex-col items-center gap-2">
          <router-link to="/Profile" @click="closeMenu">Profile</router-link>
          <button @click="() => { logout(); closeMenu(); }"
                  class="bg-red-500 text-white px-5 py-2 rounded-full shadow hover:bg-red-600">
            Logout
          </button>
        </div>

        <!-- not logged in -->
        <router-link v-else :to="buttonLink"
          class="bg-[#A5C79B] text-white px-5 py-2 rounded-full shadow hover:bg-green-600"
          @click="closeMenu"
        >
          {{ buttonText }}
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoSigma from '@/assets/Logo.png'

const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const navbarVisible = ref(false)
const logoColor = '#5B8A62'

const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem("token")
  setTimeout(() => navbarVisible.value = true, 100)
})

const logout = () => {
  localStorage.removeItem("token")
  isLoggedIn.value = false
  router.push("/Sign_In")
}

const closeMenu = () => menuOpen.value = false

const buttonText = computed(() => {
  if (isLoggedIn.value) return ''
  if (route.name === 'Sign In') return 'Sign Up'
  if (route.name === 'Sign Up') return 'Sign In'
  return 'Login'
})

const buttonLink = computed(() => {
  if (isLoggedIn.value) return ''
  if (route.name === 'Sign In') return '/Sign_Up'
  if (route.name === 'Sign Up') return '/Sign_In'
  return '/Sign_In'
})

const active = (path) => {
  return route.path === path
    ? 'text-[#5B8A62] underline underline-offset-4'
    : 'text-gray-700 hover:text-[#5B8A62]'
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
