<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { auth } from '@/firebase/firebase';
import Navbar from '@/components/Navbar.vue';

// STATE
const activeTab = ref('rfq');
const loading = ref(false);
const rfqs = ref([]);
const products = ref([]);
const users = ref([]);
const showProductModal = ref(false);
const newProduct = ref({ name: '', description: '', price: 0, stock: 0, image: null });

// FETCH DATA
const fetchData = async () => {
  loading.value = true;
  try {
    const token = await auth.currentUser.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };

    if (activeTab.value === 'rfq') {
      const res = await axios.get('http://localhost:3000/rfq/all', { headers });
      rfqs.value = res.data;
    } else if (activeTab.value === 'products') {
      const res = await axios.get('http://localhost:3000/products');
      products.value = res.data;
    } else if (activeTab.value === 'users') {
      const res = await axios.get('http://localhost:3000/auth/users', { headers });
      users.value = res.data;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// CRUD LOGIC (Sama seperti sebelumnya)
const handleFileChange = (e) => newProduct.value.image = e.target.files[0];
const submitProduct = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const formData = new FormData();
    formData.append('name', newProduct.value.name);
    formData.append('description', newProduct.value.description);
    formData.append('price', newProduct.value.price);
    formData.append('stock', newProduct.value.stock);
    if(newProduct.value.image) formData.append('image', newProduct.value.image);

    await axios.post('http://localhost:3000/products', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    showProductModal.value = false; fetchData();
  } catch(err) { alert("Gagal"); }
};
const deleteProduct = async (id) => {
  if(confirm("Hapus?")) {
    const token = await auth.currentUser.getIdToken();
    await axios.delete(`http://localhost:3000/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  }
};
const toggleRole = async (user) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin';
  if(confirm(`Ubah ke ${newRole}?`)) {
    const token = await auth.currentUser.getIdToken();
    await axios.put(`http://localhost:3000/auth/users/${user.id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  }
};

onMounted(() => setTimeout(() => fetchData(), 1000));
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Navbar />

    <div class="flex flex-1 pt-16">
      <aside class="w-64 bg-white shadow-md z-10 hidden md:flex flex-col justify-between fixed h-full pt-4 pb-24">
        <div>
          <div class="p-6">
            <h2 class="text-xl font-bold text-[#5B8A62]">Admin Panel</h2>
            <p class="text-xs text-gray-400">Manage Everything</p>
          </div>
          <nav>
            <button @click="activeTab='rfq'; fetchData()" :class="activeTab==='rfq'?'bg-green-50 text-green-700 border-r-4 border-green-600':''" class="w-full text-left px-6 py-3 font-medium hover:bg-gray-50 transition">
              📄 Request Penawaran
            </button>
            <button @click="activeTab='products'; fetchData()" :class="activeTab==='products'?'bg-green-50 text-green-700 border-r-4 border-green-600':''" class="w-full text-left px-6 py-3 font-medium hover:bg-gray-50 transition">
              📦 Kelola Produk
            </button>
            <button @click="activeTab='users'; fetchData()" :class="activeTab==='users'?'bg-green-50 text-green-700 border-r-4 border-green-600':''" class="w-full text-left px-6 py-3 font-medium hover:bg-gray-50 transition">
              👥 Kelola Users
            </button>
          </nav>
        </div>
        <div class="px-4">
            <router-link to="/" class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                🏠 Lihat Website
            </router-link>
        </div>
      </aside>

      <main class="flex-1 p-6 md:p-10 ml-0 md:ml-64 overflow-y-auto">

         <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800 uppercase">{{ activeTab }} Management</h1>
            <button v-if="activeTab==='products'" @click="showProductModal=true" class="bg-[#5B8A62] text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">+ Tambah Produk</button>
         </div>

         <div v-if="activeTab === 'rfq'" class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-gray-50 border-b">
                <tr><th class="p-4">Tanggal</th><th class="p-4">RS</th><th class="p-4">Produk</th><th class="p-4">Status</th></tr>
              </thead>
              <tbody>
                <tr v-for="item in rfqs" :key="item.id" class="border-b hover:bg-gray-50">
                  <td class="p-4 text-sm">{{ new Date(item.created_at).toLocaleDateString() }}</td>
                  <td class="p-4 font-bold">{{ item.hospital_name }}</td>
                  <td class="p-4 text-sm">{{ item.product_name }} (x{{ item.quantity }})</td>
                  <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800">{{ item.status }}</span></td>
                </tr>
              </tbody>
            </table>
         </div>

         <div v-if="activeTab === 'products'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="p in products" :key="p.id" class="bg-white p-4 rounded shadow relative group">
              <img :src="p.image_url ? `http://localhost:3000/uploads/${p.image_url}` : 'https://via.placeholder.com/150'" class="w-full h-40 object-cover rounded mb-4"/>
              <h3 class="font-bold">{{ p.name }}</h3>
              <p class="text-sm text-gray-500">Stok: {{ p.stock }}</p>
              <button @click="deleteProduct(p.id)" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">🗑️</button>
            </div>
         </div>

         <div v-if="activeTab === 'users'" class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-gray-50 border-b"><tr><th class="p-4">Nama</th><th class="p-4">Email</th><th class="p-4">Role</th><th class="p-4">Aksi</th></tr></thead>
              <tbody>
                <tr v-for="u in users" :key="u.id" class="border-b hover:bg-gray-50">
                  <td class="p-4 font-bold">{{ u.name }}</td>
                  <td class="p-4 text-gray-500">{{ u.email }}</td>
                  <td class="p-4 uppercase font-bold text-xs">{{ u.role }}</td>
                  <td class="p-4"><button @click="toggleRole(u)" class="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50">Ubah Role</button></td>
                </tr>
              </tbody>
            </table>
         </div>

      </main>
    </div>

    <div v-if="showProductModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Tambah Produk</h3>
        <form @submit.prevent="submitProduct" class="space-y-3">
          <input v-model="newProduct.name" placeholder="Nama" class="w-full border p-2 rounded" required />
          <textarea v-model="newProduct.description" placeholder="Deskripsi" class="w-full border p-2 rounded"></textarea>
          <div class="flex gap-2">
             <input v-model="newProduct.price" type="number" placeholder="Harga" class="w-full border p-2 rounded"/>
             <input v-model="newProduct.stock" type="number" placeholder="Stok" class="w-full border p-2 rounded"/>
          </div>
          <input type="file" @change="handleFileChange" class="w-full text-sm"/>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showProductModal=false" class="text-gray-500">Batal</button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
