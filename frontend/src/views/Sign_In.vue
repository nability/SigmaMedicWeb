<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import Navbar from "@/components/Navbar.vue"

// 🔥 Firebase
import { auth } from "@/firebase/firebase"
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"

const router = useRouter()

// ===============================
// FORM STATE
// ===============================
const email = ref("")
const password = ref("")
const errorMessage = ref("")

const isFormValid = computed(() => {
  return email.value.trim() !== "" && password.value.trim() !== ""
})

// ===============================
// SYNC USER KE MYSQL
// ===============================
const syncUserToDB = async (token) => {
  try {
    await axios.post(
      "http://localhost:3000/auth/sync-user",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (err) {
    console.error("Sync user gagal", err)
  }
}

// ===============================
// EMAIL / PASSWORD LOGIN
// ===============================
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const token = await userCredential.user.getIdToken()

    localStorage.setItem("token", token)

    // 🔥 WAJIB DI SINI
    await syncUserToDB(token)

    router.push("/Profile")
  } catch (error) {
    errorMessage.value = "Login gagal. Email atau password salah."
  }
}

// ===============================
// GOOGLE LOGIN
// ===============================
const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)
    const token = await result.user.getIdToken()

    localStorage.setItem("token", token)

    // 🔥 WAJIB DI SINI
    await syncUserToDB(token)

    router.push("/Profile")
  } catch (err) {
    errorMessage.value = "Login dengan Google gagal"
  }
}
</script>



<template>
  <div class="min-h-screen flex flex-col overflow-hidden">
    <Navbar />

    <main class="flex flex-1 bg-white min-h-screen overflow-hidden pt-14 pl-35">
      <div class="w-full md:w-[55%] flex flex-col justify-center px-24">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold mb-5 text-black">Selamat Datang</h1>

          <!-- ERROR -->
          <p v-if="errorMessage" class="text-red-600 text-sm mb-2">
            {{ errorMessage }}
          </p>

          <!-- === FORM LOGIN === -->
          <form class="w-full space-y-4" @submit.prevent="login">
            <div>
              <label class="block text-sm font-semibold">Email address</label>
              <input
                v-model="email"
                type="email"
                placeholder="Email.."
                class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="Password.."
                class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'w-full text-white py-2 rounded-md transition-colors duration-200',
                isFormValid
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-[#EDF2F7] text-gray-400 cursor-not-allowed',
              ]"
            >
              Sign In
            </button>

            <div class="flex items-center my-4">
              <div class="flex-1 h-px bg-[#EDF2F7]"></div>
              <p class="mx-3 text-sm text-gray-500">or</p>
              <div class="flex-1 h-px bg-[#EDF2F7]"></div>
            </div>

            <!-- === GOOGLE BUTTON (fixed type="button") === -->
            <div class="flex justify-center gap-3">
              <button
                type="button"
                @click="handleGoogleLogin"
                class="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  class="w-4 h-4"
                />
                Sign in with Google
              </button>

              <button
                type="button"
                class="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg"
                  class="w-4 h-4"
                />
                Sign in with Apple
              </button>
            </div>

            <p class="text-center text-sm mt-4">
              Belum punya akun?
              <router-link to="/Sign_Up" class="text-green-600 font-semibold">
                Sign Up
              </router-link>
            </p>
          </form>
        </div>
      </div>

      <div
        class="hidden md:block md:w-[45%] bg-[#69BD79] rounded-l-[3rem] h-screen"
      ></div>
    </main>
  </div>
</template>
