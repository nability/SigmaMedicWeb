<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const agree = ref(false)

// messages
const errorMessage = ref('')
const successMessage = ref('')

// validate form
const isFormValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    agree.value === true
  )
})

// REGISTER FUNCTION
const register = async () => {
  try {
    const res = await axios.post('http://localhost:3000/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })



    successMessage.value = 'Berhasil mendaftar! Mengarahkan ke halaman login...'
    errorMessage.value = ''

    // redirect setelah 1.5 detik
    setTimeout(() => {
      router.push('/Sign_In')
    }, 1500)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal mendaftar'
    successMessage.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-hidden">
    <Navbar />

    <main class="flex flex-1 bg-white min-h-screen overflow-hidden pt-14 pl-35">
      <div class="w-full md:w-[55%] flex flex-col justify-center px-24">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold mb-5 text-black">Ayo Daftar Sekarang</h1>

          <!-- ERROR & SUCCESS -->
          <p v-if="errorMessage" class="text-red-600 text-sm mb-2">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-600 text-sm mb-2">{{ successMessage }}</p>

          <form class="w-full space-y-4" @submit.prevent="register">
            <div>
              <label class="block text-sm font-semibold">Name</label>
              <input
                v-model="name"
                type="text"
                placeholder="Name.."
                class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

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

            <div class="flex items-center space-x-2 text-sm">
              <input v-model="agree" type="checkbox" class="accent-green-600" />
              <span>I agree to the terms & policy</span>
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
              Sign Up
            </button>

            <div class="flex items-center my-4">
              <div class="flex-1 h-px bg-[#EDF2F7]"></div>
              <p class="mx-3 text-sm text-gray-500">or</p>
              <div class="flex-1 h-px bg-[#EDF2F7]"></div>
            </div>

            <div class="flex justify-center gap-3">
              <button
                class="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-4 h-4" />
                Sign up with Google
              </button>
              <button
                class="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg" class="w-4 h-4" />
                Sign up with Apple
              </button>
            </div>

            <p class="text-center text-sm mt-4">
              Have an account?
              <router-link to="/Sign_In" class="text-green-600 font-semibold">Sign In</router-link>
            </p>
          </form>
        </div>
      </div>

      <div class="hidden md:block md:w-[45%] bg-[#69BD79] rounded-l-[3rem] h-screen"></div>
    </main>
  </div>
</template>
