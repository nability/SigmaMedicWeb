<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import Navbar from "@/components/Navbar.vue"
import { auth } from "@/firebase/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const router = useRouter()
const email = ref("")
const password = ref("")
const errorMessage = ref("")

const isFormValid = computed(() => email.value.trim() !== "" && password.value.trim() !== "")

// --- SYNC & AMBIL ROLE ---
const syncUserAndGetRole = async (token) => {
  try {
    const res = await axios.post("http://localhost:3000/auth/sync-user", {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data.user.role // Backend return role (admin/user)
  } catch (err) {
    console.error("Sync error:", err)
    return 'user'
  }
}

// --- LOGIC REDIRECT ---
const handleRedirect = (role) => {
  localStorage.setItem("user_role", role) // SIMPAN ROLE

  if (role === 'admin') {
    router.push("/admin")
  } else {
    router.push("/akun")
  }
}

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const token = await userCredential.user.getIdToken()
    localStorage.setItem("token", token)

    // Tunggu backend confirm role dulu
    const role = await syncUserAndGetRole(token)
    handleRedirect(role)

  } catch (error) {
    errorMessage.value = "Email atau password salah."
  }
}

const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const token = await result.user.getIdToken()
    localStorage.setItem("token", token)

    const role = await syncUserAndGetRole(token)
    handleRedirect(role)
  } catch (err) {
    errorMessage.value = "Login Google gagal"
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-hidden">
    <Navbar />
    <main class="flex flex-1 bg-white min-h-screen overflow-hidden pt-14 pl-0 md:pl-35">
      <div class="w-full md:w-[55%] flex flex-col justify-center px-8 md:px-24 py-10">
        <div class="max-w-md w-full mx-auto md:mx-0">
          <h1 class="text-4xl md:text-5xl font-bold mb-5 text-black">Selamat Datang</h1>

          <p v-if="errorMessage" class="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm border border-red-200">
            {{ errorMessage }}
          </p>

          <form class="w-full space-y-4" @submit.prevent="login">
            <div>
              <label class="block text-sm font-semibold mb-1">Email address</label>
              <input v-model="email" type="email" class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Password</label>
              <input v-model="password" type="password" class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500" />
            </div>
            <button type="submit" :disabled="!isFormValid" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300">
              Sign In
            </button>
            <div class="flex items-center my-4">
               <div class="flex-1 h-px bg-gray-200"></div>
               <p class="mx-3 text-sm text-gray-500">or</p>
               <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <button type="button" @click="handleGoogleLogin" class="w-full border rounded-md px-3 py-2 text-sm hover:bg-gray-50 flex justify-center items-center gap-2">
              <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-4 h-4" /> Sign in with Google
            </button>
            <p class="text-center text-sm mt-4">
              Belum punya akun? <router-link to="/Sign_Up" class="text-green-600 font-bold">Sign Up</router-link>
            </p>
          </form>
        </div>
      </div>
      <div class="hidden md:block md:w-[45%] bg-[#69BD79] rounded-l-[3rem] h-screen"></div>
    </main>
  </div>
</template>
