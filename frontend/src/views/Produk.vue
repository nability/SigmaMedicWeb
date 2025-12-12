<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

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
      harga: p.price,
      img: p.image_url
        ? `http://localhost:3000/uploads/${p.image_url}`
        : new URL("@/assets/no-image.png", import.meta.url).href,
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

/* MODAL */
const showModal = ref(false);
const selectedItem = ref(null);

const selesaikanPembelian = (item) => {
  selectedItem.value = item;
  showModal.value = true;
  item.showDetail = false;
};

/* OBSERVER */
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
  getProducts(); // Ambil produk dari database

  setTimeout(() => (heroVisible.value = true), 200);

  if (produkSection.value) {
    observeVisibility(produkSection.value, (v) => (produkVisible.value = v));
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <Navbar />

    <!-- HERO -->
    <section
      ref="heroSection"
      class="bg-[#E7F4E4] py-22 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      :class="{ 'opacity-100 translate-y-0': heroVisible }"
    >
      <div class="flex-1 space-y-4">
        <h1 class="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
          Solusi medis terdepan untuk kebutuhan kesehatan anda
        </h1>
        <p class="text-gray-600">
          Sigma Medic menyediakan peralatan medis berkualitas tinggi untuk profesional kesehatan.
        </p>
      </div>

      <div class="flex-1">
        <img
          src="@/assets/image-page-produk.jpg"
          class="rounded-2xl w-full object-cover shadow-md"
        />
      </div>
    </section>

    <!-- PRODUK -->
    <section
      ref="produkSection"
      class="py-16 px-6 md:px-20 bg-white text-center opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      :class="{ 'opacity-100 translate-y-0': produkVisible }"
    >
      <h2 class="text-sm uppercase text-gray-500 mb-2">Produk</h2>
      <h1 class="text-3xl font-semibold text-gray-800 mb-10">Produk Unggulan Sigma Medic</h1>

      <!-- GRID -->
      <transition-group
        name="fade-up"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center"
      >
        <div
          v-for="(item, index) in produkList"
          :key="item.id"
          @click="toggleDetail(index)"
          class="border rounded-xl shadow-sm hover:shadow-xl bg-white p-4 w-full max-w-[250px] transform hover:-translate-y-2 cursor-pointer opacity-0 translate-y-8 transition-all duration-500"
          :style="{ transitionDelay: produkVisible ? `${0.1 * index}s` : '0s' }"
          :class="{ 'opacity-100 translate-y-0': produkVisible }"
        >
          <img :src="item.img" class="w-full h-40 object-cover rounded-md mb-3" />
          <h3 class="text-lg font-semibold mb-1">{{ item.name }}</h3>
          <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ item.desc }}</p>

          <!-- DETAIL -->
          <transition name="expand">
            <div
              v-if="item.showDetail"
              class="bg-[#F4FAF2] p-3 mt-2 rounded-lg border-t border-[#A5C79B]/30"
            >
              <p class="font-semibold mb-2">
                Harga:
                <span class="text-[#5B8A62]">
                  Rp {{ (item.harga * item.jumlah).toLocaleString("id-ID") }}
                </span>
              </p>

              <div class="flex items-center justify-center gap-3 mb-3">
                <button class="w-8 h-8 bg-[#A5C79B] text-white rounded-full" @click.stop="kurangiJumlah(index)">-</button>
                <span class="font-semibold">{{ item.jumlah }}</span>
                <button class="w-8 h-8 bg-[#A5C79B] text-white rounded-full" @click.stop="tambahJumlah(index)">+</button>
              </div>

              <button
                @click.stop="selesaikanPembelian(item)"
                class="bg-[#A5C79B] text-white w-full py-2 rounded-lg"
              >
                Beli Sekarang
              </button>
            </div>
          </transition>
        </div>
      </transition-group>
    </section>

    <!-- MODAL -->
    <transition name="fade-scale">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-sm">
          <h2 class="text-2xl font-semibold text-[#5B8A62]">🎉 Selamat!</h2>
          <p class="text-gray-700 mb-4">
            Pembelian <strong>{{ selectedItem?.name }}</strong> berhasil dilakukan.
          </p>
          <button
            @click="showModal = false"
            class="bg-[#A5C79B] text-white px-6 py-2 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </transition>

    <Footer />
  </div>
</template>
