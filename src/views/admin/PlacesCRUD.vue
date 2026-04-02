<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">Manage Places</h2>
      <span class="text-sm text-gray-500">{{ places.length }} total</span>
    </div>

    <!-- Search -->
    <div class="relative">
      <input v-model="search" type="search" placeholder="Search places..."
        class="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-rose-400 focus:ring-rose-200" />
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.2-5.2M16 10a6 6 0 11-12 0 6 6 0 0112 0z"/>
      </svg>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-14 rounded-xl bg-gray-100 animate-pulse"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{{ error }}</div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table class="min-w-full divide-y divide-gray-100 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">State</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Category</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-600">Verified</th>
            <th class="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 bg-white">
          <tr v-for="place in filteredPlaces" :key="place.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-3 font-medium text-gray-900">
              <router-link :to="`/place/${place.slug}`" class="hover:text-rose-600 transition">
                {{ place.name }}
              </router-link>
            </td>
            <td class="px-4 py-3 text-gray-500 hidden sm:table-cell">{{ place.states?.name || '—' }}</td>
            <td class="px-4 py-3 text-gray-500 hidden md:table-cell">{{ place.categories?.name || '—' }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="toggleVerified(place)"
                class="inline-flex items-center justify-center h-6 w-6 rounded-full transition"
                :class="place.is_verified ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'">
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="confirmDelete(place)"
                class="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredPlaces.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-400">No places found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-900">Delete "{{ deleteTarget.name }}"?</h3>
        <p class="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
        <div class="mt-5 flex gap-3">
          <button @click="deleteTarget = null"
            class="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button @click="deletePlace"
            class="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import { useToast } from 'vue-toastification'

export default {
  name: 'PlacesCRUD',
  data() {
    return { places: [], isLoading: false, error: null, search: '', deleteTarget: null }
  },
  computed: {
    filteredPlaces() {
      if (!this.search.trim()) return this.places
      const q = this.search.toLowerCase()
      return this.places.filter(p => p.name.toLowerCase().includes(q))
    }
  },
  methods: {
    async fetchPlaces() {
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('places')
          .select('id, name, slug, is_verified, states(name), categories(name)')
          .order('name', { ascending: true })
        if (error) throw error
        this.places = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
    async toggleVerified(place) {
      const toast = useToast()
      const { error } = await supabase
        .from('places').update({ is_verified: !place.is_verified }).eq('id', place.id)
      if (error) { toast.error(error.message); return }
      place.is_verified = !place.is_verified
      toast.success(`${place.name} ${place.is_verified ? 'verified' : 'unverified'}`)
    },
    confirmDelete(place) { this.deleteTarget = place },
    async deletePlace() {
      const toast = useToast()
      const { error } = await supabase.from('places').delete().eq('id', this.deleteTarget.id)
      if (error) { toast.error(error.message); return }
      this.places = this.places.filter(p => p.id !== this.deleteTarget.id)
      toast.success(`"${this.deleteTarget.name}" deleted.`)
      this.deleteTarget = null
    }
  },
  mounted() { this.fetchPlaces() }
}
</script>
