<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import Navbar from "@/components/Navbar.vue"

// 🔥 Firebase
import { auth } from "@/firebase/firebase"
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"

const router = useRouter()

// ===============================
// FORM STATE
// ===============================
const name = ref("")
const email = ref("")
const password = ref("")
const errorMessage = ref("")
const isLoading = ref(false)

const isFormValid = computed(() => {
  return name.value.trim() !== "" &&
         email.value.trim() !== "" &&
         password.value.length >= 6 // Firebase butuh min 6 karakter
})

// ===============================
// SYNC USER KE MYSQL (Sama seperti Login)
// ===============================
const syncUserToDB = async (token) => {
  try {
    await axios.post(
      "http://localhost:3000/auth/sync-user",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  } catch (err) {
    console.error("Gagal sinkronisasi user ke database:", err)
    // Kita tidak throw error disini agar user tetap bisa masuk
    // meskipun sync DB gagal (nanti bisa sync ulang saat login)
  }
}

// ===============================
// LOGIC DAFTAR (REGISTER)
// ===============================
const register = async () => {
  isLoading.value = true
  errorMessage.value = ""

  try {
    // 1. Buat User di Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    const user = userCredential.user

    // 2. Update Nama User di Firebase (PENTING!)
    // Agar di Navbar nanti muncul namanya, bukan cuma email
    await updateProfile(user, {
      displayName: name.value
    })

    // 3. Ambil Token Terbaru
    // Kita force refresh token agar displayName terbaru terbawa
    const token = await user.getIdToken(true)
    localStorage.setItem("token", token)

    // 4. Masukkan data ke MySQL
    await syncUserToDB(token)

    // 5. Sukses -> Arahkan ke Dashboard Akun
    router.push("/akun")

  } catch (error) {
    console.error(error)
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = "Email ini sudah terdaftar. Silakan Login."
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = "Password terlalu lemah (min. 6 karakter)."
    } else {
      errorMessage.value = "Gagal mendaftar. Silakan coba lagi."
    }
  } finally {
    isLoading.value = false
  }
}

// ===============================
// GOOGLE LOGIN (Opsional di halaman daftar)
// ===============================
const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const token = await result.user.getIdToken()
    localStorage.setItem("token", token)
    await syncUserToDB(token)
    router.push("/akun")
  } catch (err) {
    errorMessage.value = "Gagal login dengan Google"
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-hidden">
    <Navbar />

    <main class="flex flex-1 bg-white min-h-screen overflow-hidden pt-14 pl-0 md:pl-35">
      <div class="w-full md:w-[55%] flex flex-col justify-center px-8 md:px-24 py-10">
        <div class="max-w-md w-full mx-auto md:mx-0">
          <h1 class="text-4xl md:text-5xl font-bold mb-2 text-black">Buat Akun</h1>
          <p class="text-gray-500 mb-8">Bergabunglah dengan Sigma Medic.</p>

          <div v-if="errorMessage" class="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm mb-4 border border-red-200">
            {{ errorMessage }}
          </div>

          <form class="w-full space-y-4" @submit.prevent="register">

            <div>
              <label class="block text-sm font-semibold mb-1">Nama Lengkap</label>
              <input
                v-model="name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1">Email address</label>
              <input
                v-model="email"
                type="email"
                placeholder="email@anda.com"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="Minimal 6 karakter"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              :class="[
                'w-full text-white py-2.5 rounded-md transition-all duration-200 font-medium',
                isFormValid && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              <span v-if="isLoading">Memproses...</span>
              <span v-else>Daftar Sekarang</span>
            </button>

            <div class="flex items-center my-4">
              <div class="flex-1 h-px bg-gray-200"></div>
              <p class="mx-3 text-xs text-gray-400 uppercase">Atau daftar dengan</p>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              type="button"
              @click="handleGoogleLogin"
              class="w-full flex justify-center items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-4 h-4" />
              Sign up with Google
            </button>

            <p class="text-center text-sm mt-6">
              Sudah punya akun?
              <router-link to="/Sign_In" class="text-green-600 font-bold hover:underline">
                Login disini
              </router-link>
            </p>
          </form>
        </div>
      </div>

      <div class="hidden md:block md:w-[45%] bg-[#69BD79] rounded-l-[3rem] relative overflow-hidden">
         <div class="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-6xl">
            Sigma Medic
         </div>
      </div>
    </main>
  </div>
</template>
