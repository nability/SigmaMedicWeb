<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- ✅ Navbar -->
    <Navbar />

    <!-- ✅ Hero Section -->
    <section
      ref="heroSection"
      class="bg-[#E7F4E4] py-22 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 opacity-0 translate-y-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="{ 'opacity-100 translate-y-0': heroVisible }"
    >
      <div class="flex-1 space-y-4">
        <h1 class="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
          Solusi medis terdepan untuk kebutuhan kesehatan anda
        </h1>
        <p class="text-gray-600">
          Sigma Medic menyediakan peralatan medis berkualitas tinggi untuk profesional kesehatan.
          Kami berkomitmen memberikan teknologi terbaik yang mendukung diagnosis dan perawatan
          pasien.
        </p>
        <div class="flex gap-3 pt-3">
          <button class="bg-[#A5C79B] text-white px-5 py-2 rounded hover:bg-[#8EBB82] transition">
            Selengkapnya
          </button>
          <router-link
            to="/kontak"
            class="border border-[#A5C79B] text-[#5B8A62] px-5 py-2 rounded hover:bg-[#A5C79B]/10 transition text-center"
          >
            Kontak
          </router-link>
        </div>
      </div>

      <div class="flex-1">
        <img
          src="@/assets/image-page-produk.jpg"
          alt="Peralatan Medis"
          class="rounded-2xl w-full object-cover shadow-md"
        />
      </div>
    </section>

    <!-- ✅ Produk Section -->
    <section
      ref="produkSection"
      class="py-16 px-6 md:px-20 bg-white text-center opacity-0 translate-y-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="{ 'opacity-100 translate-y-0': produkVisible }"
    >
      <h2 class="text-sm uppercase text-gray-500 mb-2">Produk</h2>
      <h1 class="text-3xl font-semibold text-gray-800 mb-10">Produk Unggulan Sigma Medic</h1>

      <!-- ✅ Grid Produk -->
      <transition-group
        name="fade-up"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center"
      >
        <div
          v-for="(item, index) in produkList"
          :key="item.name"
          @click="toggleDetail(index)"
          class="border rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 bg-white p-4 w-full max-w-[250px] transform hover:-translate-y-2 cursor-pointer opacity-0 translate-y-8"
          :class="{ 'opacity-100 translate-y-0': produkVisible }"
          :style="{
            transitionDelay: produkVisible ? `${0.1 * index}s` : '0s',
          }"
        >
          <img :src="item.img" :alt="item.name" class="w-full h-40 object-cover rounded-md mb-3" />
          <h3 class="text-lg font-semibold mb-1">{{ item.name }}</h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.desc }}</p>

          <!-- ✅ Detail Produk Expand -->
          <transition name="expand">
            <div
              v-if="item.showDetail"
              class="bg-[#F4FAF2] p-3 mt-2 rounded-lg border-t border-[#A5C79B]/30"
            >
              <p class="text-base font-semibold mb-2">
                Harga:
                <span class="text-[#5B8A62]">
                  Rp {{ (item.harga * item.jumlah).toLocaleString('id-ID') }}
                </span>
                <span class="text-sm text-gray-500 ml-1">
                  ({{ item.jumlah }} × Rp{{ item.harga.toLocaleString('id-ID') }})
                </span>
              </p>

              <div class="flex items-center justify-center gap-3 mb-3">
                <button
                  @click.stop="kurangiJumlah(index)"
                  class="w-8 h-8 bg-[#A5C79B] text-white rounded-full hover:bg-[#8EBB82]"
                >
                  -
                </button>
                <span class="font-semibold text-gray-800">{{ item.jumlah }}</span>
                <button
                  @click.stop="tambahJumlah(index)"
                  class="w-8 h-8 bg-[#A5C79B] text-white rounded-full hover:bg-[#8EBB82]"
                >
                  +
                </button>
              </div>

              <button
                @click.stop="selesaikanPembelian(item)"
                class="bg-[#A5C79B] text-white w-full py-2 rounded-lg hover:bg-[#8EBB82] transition"
              >
                Beli Sekarang
              </button>
            </div>
          </transition>
        </div>
      </transition-group>
    </section>

    <!-- ✅ Modal Popup -->
    <transition name="fade-scale">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center animate-pop">
          <h2 class="text-2xl font-semibold text-[#5B8A62] mb-3">🎉 Selamat!</h2>
          <p class="text-gray-700 mb-4">
            Pembelian <strong>{{ selectedItem?.name }}</strong> berhasil dilakukan.
          </p>
          <button
            @click="showModal = false"
            class="bg-[#A5C79B] text-white px-6 py-2 rounded-lg hover:bg-[#8EBB82] transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </transition>

    <!-- ✅ Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

/* ✅ Ref untuk section */
const heroSection = ref(null)
const produkSection = ref(null)

/* ✅ Produk Lengkap (8 item) */
const produkList = ref([
  { name: 'SafeTouch InjectPro', desc: 'Disposable syringe jarum suntik steril dan aman digunakan.', harga: 55000, img: new URL('@/assets/SafeTouch-InjectPro.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'Surgical Set', desc: 'Set instrumen pembedahan dengan kualitas tinggi.', harga: 250000, img: new URL('@/assets/Surgical-set.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'Walker', desc: 'Rangka aluminium ringan membantu mobilitas pasien.', harga: 350000, img: new URL('@/assets/Walker.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'Walker Set', desc: 'Dilengkapi tambahan roda dan pegangan empuk.', harga: 420000, img: new URL('@/assets/Walker-set.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'Dental Equipment', desc: 'Perangkat gigi berkualitas tinggi untuk klinik.', harga: 780000, img: new URL('@/assets/Dental-equipment.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'Hospital Bed', desc: 'Tempat tidur rumah sakit elektrik multifungsi.', harga: 12000000, img: new URL('@/assets/Hospital-bed.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'Bed Screen', desc: 'Sekat tempat tidur pasien yang modern dan mudah dipindahkan.', harga: 450000, img: new URL('@/assets/Bed-screen.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
  { name: 'First Aid Kit', desc: 'Perlengkapan medis darurat lengkap dan portabel.', harga: 250000, img: new URL('@/assets/First-aid-kit.jpg', import.meta.url).href, jumlah: 1, showDetail: false },
])

/* ✅ Animasi scroll visibility */
const heroVisible = ref(false)
const produkVisible = ref(false)

/* ✅ Modal data */
const showModal = ref(false)
const selectedItem = ref(null)

/* ✅ Fungsi interaksi produk */
const toggleDetail = (index) => (produkList.value[index].showDetail = !produkList.value[index].showDetail)
const tambahJumlah = (index) => produkList.value[index].jumlah++
const kurangiJumlah = (index) => produkList.value[index].jumlah > 1 && produkList.value[index].jumlah--
const selesaikanPembelian = (item) => {
  selectedItem.value = item
  showModal.value = true
  item.showDetail = false
}

/* ✅ Intersection Observer */
const observeVisibility = (target, callback) => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && callback(true)),
    { threshold: 0.2 }
  )
  observer.observe(target)
}

/* ✅ Lifecycle */
onMounted(() => {
  setTimeout(() => (heroVisible.value = true), 200)
  if (produkSection.value) {
    observeVisibility(produkSection.value, (v) => (produkVisible.value = v))
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ✅ expand animasi */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ✅ modal fade-scale */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* ✅ fade-up animasi untuk produk grid */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

/* ✅ animasi modal popup */
.animate-pop {
  animation: popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
