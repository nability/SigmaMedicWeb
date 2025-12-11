<template>
  <footer class="mt-0">
    <!-- 🏥 Bagian Rumah Sakit -->
    <div class="bg-[#D7EAD1] text-gray-700 flex flex-col items-center py-10">
      <p class="text-sm mb-4 font-medium">
        Dipercaya oleh Rumah Sakit dan Klinik Terkemuka di Indonesia
      </p>
      <div class="flex gap-8 flex-wrap justify-center items-center text-gray-600 font-semibold">
        <span>RS. Betha Medika</span>
        <span>RS. Kartika Kasih</span>
        <span>RSUD R. Syamsudin</span>
        <span>RS. Sekar Wangi</span>
      </div>
    </div>

    <!-- 🩺 Informasi Utama -->
    <div class="bg-[#A5C79B] text-gray-800 px-10 py-10 grid md:grid-cols-3 gap-8">
      <div>
        <img
          src="@/assets/Logo.png"
          alt="Logo Sigma Medic"
          class="h-12 w-auto mb-3 drop-shadow-md"
        />
      </div>

      <div>
        <h3 class="font-semibold mb-2 text-lg">Tentang Kami</h3>
        <p class="text-sm leading-relaxed">
          Sigma Medic berdedikasi menghadirkan teknologi medis terkini. Kami memahami kebutuhan
          rumah sakit dan klinik akan peralatan presisi dan handal.
        </p>
      </div>

      <div>
        <h3 class="font-semibold mb-2 text-lg">Hubungi Kami</h3>
        <p class="text-sm mb-1">📞 +62-8572-01882</p>
        <p class="text-sm mb-1">✉️ sigmamedic@gmail.com</p>
        <p class="text-sm mb-1">🏢 Jalan Cibolang Kaler Nomor</p>
      </div>
    </div>

    <!-- 🌐 Bagian Bawah Footer -->
    <div class="bg-[#A5C79B] text-gray-800 px-10 pb-8 pt-4 border-t border-white/20">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-center md:text-left">
          <span>© 2024 Sigma Medic. Hak cipta dilindungi.</span>
          <a href="#" class="hover:underline">Kebijakan privasi</a>
          <a href="#" class="hover:underline">Syarat dan ketentuan</a>
          <a href="#" class="hover:underline">Pengaturan cookies</a>
        </div>

        <!-- 🌟 Ikon Sosial Media -->
        <div class="flex gap-5 text-2xl text-gray-700">
          <a href="#" class="hover:text-[#3b5998] transition-all duration-300" aria-label="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" class="hover:text-[#E1306C] transition-all duration-300" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="hover:text-black transition-all duration-300" aria-label="X (Twitter)">
            <i class="fab fa-x-twitter"></i>
          </a>
          <a href="#" class="hover:text-[#0077b5] transition-all duration-300" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="#" class="hover:text-[#FF0000] transition-all duration-300" aria-label="YouTube">
            <i class="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Tambahkan sedikit hover efek biar smooth */
i {
  transition: transform 0.3s ease;
}
i:hover {
  transform: translateY(-3px);
}
</style>
