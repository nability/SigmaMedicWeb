<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

// 🔥 Import Firebase Auth untuk cek login
import { auth } from "@/firebase/firebase";

const router = useRouter();

/* SECTION VISIBILITY */
const heroSection = ref(null);
const produkSection = ref(null);
const heroVisible = ref(false);
const produkVisible = ref(false);

/* PRODUK DARI DATABASE */
const produkList = ref([]);

const getProducts = async () => {
  try {
    const res = await axios.get("http://localhost:3000/products");

    produkList.value = res.data.map((p) => ({
      id: p.id,
      name: p.name,
      desc: p.description,
      harga: p.price, // Harga estimasi
      img: p.image_url
        ? `http://localhost:3000/uploads/${p.image_url}`
        : "https://via.placeholder.com/300?text=No+Image", // Fallback image online
      jumlah: 1,
      showDetail: false,
    }));
  } catch (err) {
    console.log("Gagal mengambil produk:", err);
  }
};

/* PRODUK ACTIONS */
const toggleDetail = (index) =>
  (produkList.value[index].showDetail = !produkList.value[index].showDetail);

const tambahJumlah = (index) => produkList.value[index].jumlah++;
const kurangiJumlah = (index) =>
  produkList.value[index].jumlah > 1 && produkList.value[index].jumlah--;

/* ===============================
   LOGIC RFQ (REQUEST FOR QUOTATION)
   =============================== */
const showRFQModal = ref(false);
const isLoadingRFQ = ref(false);
const selectedItem = ref(null);

// State Form RFQ
const rfqForm = ref({
  hospital_name: "",
  license_number: "",
  notes: ""
});

// 1. Buka Modal RFQ
const openRFQModal = (item) => {
  // Cek apakah user login?
  if (!auth.currentUser) {
    alert("Silakan Login terlebih dahulu untuk mengajukan penawaran.");
    router.push("/Sign_In");
    return;
  }

  selectedItem.value = item;

  // Reset form
  rfqForm.value = {
    hospital_name: "",
    license_number: "",
    notes: ""
  };

  showRFQModal.value = true;
};

// 2. Kirim Data ke Backend
const submitRFQ = async () => {
  if (!selectedItem.value) return;
  isLoadingRFQ.value = true;

  try {
    const token = await auth.currentUser.getIdToken();

    await axios.post("http://localhost:3000/rfq", {
      product_id: selectedItem.value.id,
      quantity: selectedItem.value.jumlah,
      hospital_name: rfqForm.value.hospital_name,
      license_number: rfqForm.value.license_number,
      notes: rfqForm.value.notes
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Permintaan penawaran berhasil dikirim! Cek email atau dashboard Anda secara berkala.");
    showRFQModal.value = false;
    // Tutup detail produk di card
    selectedItem.value.showDetail = false;

  } catch (error) {
    console.error("Gagal kirim RFQ", error);
    alert("Gagal mengirim permintaan. Pastikan koneksi aman.");
  } finally {
    isLoadingRFQ.value = false;
  }
};

/* OBSERVER ANIMATION */
const observeVisibility = (target, callback) => {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach(
        (entry) => entry.isIntersecting && callback(true)
      ),
    { threshold: 0.2 }
  );
  observer.observe(target);
};

/* ON MOUNT */
onMounted(() => {
  getProducts();
  setTimeout(() => (heroVisible.value = true), 200);
  if (produkSection.value) {
    observeVisibility(produkSection.value, (v) => (produkVisible.value = v));
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white font-sans">
    <Navbar />

    <section
      ref="heroSection"
      class="bg-[#E7F4E4] py-24 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      :class="{ 'opacity-100 translate-y-0': heroVisible }"
    >
      <div class="flex-1 space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Solusi Medis Profesional & Terpercaya
        </h1>
        <p class="text-gray-600 text-lg">
          Sigma Medic menyediakan peralatan medis berstandar internasional dengan sistem pengadaan yang transparan dan aman.
        </p>
      </div>

      <div class="flex-1 w-full">
        <img
          src="@/assets/image-page-produk.jpg"
          class="rounded-2xl w-full h-[350px] object-cover shadow-lg hover:scale-[1.02] transition duration-500"
        />
      </div>
    </section>

    <section
      ref="produkSection"
      class="py-16 px-6 md:px-20 bg-white text-center opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      :class="{ 'opacity-100 translate-y-0': produkVisible }"
    >
      <h2 class="text-sm uppercase text-[#5B8A62] font-bold tracking-widest mb-2">Katalog Alat</h2>
      <h1 class="text-3xl font-bold text-gray-800 mb-12">Daftar Produk Medis</h1>

      <transition-group
        name="fade-up"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center"
      >
        <div
          v-for="(item, index) in produkList"
          :key="item.id"
          @click="toggleDetail(index)"
          class="border border-gray-100 rounded-xl shadow-sm hover:shadow-xl bg-white p-4 w-full max-w-[280px] transform hover:-translate-y-2 cursor-pointer opacity-0 translate-y-8 transition-all duration-500 flex flex-col"
          :style="{ transitionDelay: produkVisible ? `${0.1 * index}s` : '0s' }"
          :class="{ 'opacity-100 translate-y-0': produkVisible }"
        >
          <div class="h-48 w-full bg-gray-100 rounded-md overflow-hidden mb-4">
             <img :src="item.img" class="w-full h-full object-cover" />
          </div>

          <h3 class="text-lg font-bold text-gray-800 mb-1 text-left">{{ item.name }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 mb-4 text-left">{{ item.desc }}</p>

          <div class="mt-auto">
             <div v-if="!item.showDetail" class="text-green-600 text-sm font-semibold flex items-center gap-1">
                Lihat Detail
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
             </div>

            <transition name="expand">
              <div
                v-if="item.showDetail"
                class="bg-[#F4FAF2] p-4 mt-2 rounded-lg border border-[#A5C79B]/20"
                @click.stop
              >
                <div class="flex items-center justify-between bg-white rounded-md px-2 py-1 mb-4 border border-gray-200">
                  <button class="text-gray-500 hover:text-green-600 text-lg px-2" @click="kurangiJumlah(index)">-</button>
                  <span class="font-semibold text-gray-700">{{ item.jumlah }} Unit</span>
                  <button class="text-gray-500 hover:text-green-600 text-lg px-2" @click="tambahJumlah(index)">+</button>
                </div>

                <button
                  @click="openRFQModal(item)"
                  class="bg-[#5B8A62] text-white w-full py-2.5 rounded-lg font-medium text-sm hover:bg-[#4a7550] transition shadow-md flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Minta Penawaran
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition-group>
    </section>

    <transition name="fade-scale">
      <div
        v-if="showRFQModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="showRFQModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative">

          <div class="mb-6 border-b pb-4">
             <h2 class="text-2xl font-bold text-gray-800">Ajukan Penawaran</h2>
             <p class="text-sm text-gray-500 mt-1">
                Produk: <span class="font-semibold text-[#5B8A62]">{{ selectedItem?.name }}</span> ({{ selectedItem?.jumlah }} Unit)
             </p>
          </div>

          <form @submit.prevent="submitRFQ" class="space-y-4">

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Instansi / Rumah Sakit <span class="text-red-500">*</span></label>
              <input
                v-model="rfqForm.hospital_name"
                required
                type="text"
                placeholder="Contoh: RSUD Sehat Sentosa"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nomor Izin Operasional / SIP <span class="text-red-500">*</span></label>
              <input
                v-model="rfqForm.license_number"
                required
                type="text"
                placeholder="No. Izin Kemenkes / Dinas"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
              <textarea
                v-model="rfqForm.notes"
                rows="3"
                placeholder="Contoh: Butuh garansi 2 tahun & training penggunaan."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              ></textarea>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                type="button"
                @click="showRFQModal = false"
                class="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isLoadingRFQ"
                class="flex-1 py-2.5 bg-[#5B8A62] text-white rounded-lg font-medium hover:bg-[#4a7550] transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <span v-if="isLoadingRFQ" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ isLoadingRFQ ? 'Mengirim...' : 'Kirim Pengajuan' }}
              </button>
            </div>

          </form>

        </div>
      </div>
    </transition>

    <Footer />
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  opacity: 1;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding: 0 1rem; /* Biar padding juga smooth */
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
