<template>
  <div class="space-y-8">

    <!-- States -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-800">States / UTs</h2>
        <button @click="openAdd('state')"
          class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
          + Add State
        </button>
      </div>
      <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table class="min-w-full divide-y divide-gray-100 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">Slug</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-if="statesLoading"><td colspan="3" class="px-4 py-6 text-center"><div class="h-4 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div></td></tr>
            <tr v-for="s in states" :key="s.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{{ s.name }}</td>
              <td class="px-4 py-3 text-gray-400 font-mono text-xs">{{ s.slug }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="openEdit('state', s)"
                  class="mr-2 text-xs text-indigo-600 hover:underline">Edit</button>
                <button @click="confirmDelete('state', s)"
                  class="text-xs text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Categories -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-800">Themes / Categories</h2>
        <button @click="openAdd('category')"
          class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 transition">
          + Add Category
        </button>
      </div>
      <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table class="min-w-full divide-y divide-gray-100 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-if="catsLoading"><td colspan="2" class="px-4 py-6 text-center"><div class="h-4 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div></td></tr>
            <tr v-for="c in categories" :key="c.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{{ c.name }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="openEdit('category', c)"
                  class="mr-2 text-xs text-indigo-600 hover:underline">Edit</button>
                <button @click="confirmDelete('category', c)"
                  class="text-xs text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Add/Edit Modal -->
    <div v-if="modal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 capitalize">
          {{ modal.isEdit ? 'Edit' : 'Add' }} {{ modal.type }}
        </h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="modal.name" type="text"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-200" />
        </div>
        <div v-if="modal.type === 'state'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input v-model="modal.slug" type="text"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-indigo-200" />
        </div>
        <div v-if="modal.error" class="text-sm text-red-600">{{ modal.error }}</div>
        <div class="flex gap-3 pt-1">
          <button @click="modal.open = false"
            class="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button @click="saveModal" :disabled="!modal.name.trim()"
            class="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300 transition">Save</button>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-900">Delete "{{ deleteTarget.item.name }}"?</h3>
        <p class="mt-1 text-sm text-gray-500">This cannot be undone.</p>
        <div class="mt-5 flex gap-3">
          <button @click="deleteTarget = null"
            class="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button @click="deleteItem"
            class="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import { useToast } from 'vue-toastification'

export default {
  name: 'CategoriesCRUD',
  data() {
    return {
      states: [], statesLoading: false,
      categories: [], catsLoading: false,
      modal: { open: false, type: '', isEdit: false, id: null, name: '', slug: '', error: '' },
      deleteTarget: null
    }
  },
  methods: {
    async fetchStates() {
      this.statesLoading = true
      const { data } = await supabase.from('states').select('id, name, slug').order('name')
      this.states = data || []
      this.statesLoading = false
    },
    async fetchCategories() {
      this.catsLoading = true
      const { data } = await supabase.from('categories').select('id, name').order('name')
      this.categories = data || []
      this.catsLoading = false
    },
    openAdd(type) {
      this.modal = { open: true, type, isEdit: false, id: null, name: '', slug: '', error: '' }
    },
    openEdit(type, item) {
      this.modal = { open: true, type, isEdit: true, id: item.id, name: item.name, slug: item.slug || '', error: '' }
    },
    async saveModal() {
      const toast = useToast()
      this.modal.error = ''
      const table = this.modal.type === 'state' ? 'states' : 'categories'
      const payload = this.modal.type === 'state'
        ? { name: this.modal.name, slug: this.modal.slug || this.modal.name.toLowerCase().replace(/\s+/g, '-') }
        : { name: this.modal.name }

      let error
      if (this.modal.isEdit) {
        ;({ error } = await supabase.from(table).update(payload).eq('id', this.modal.id))
      } else {
        ;({ error } = await supabase.from(table).insert(payload))
      }

      if (error) { this.modal.error = error.message; return }
      toast.success(`${this.modal.type} ${this.modal.isEdit ? 'updated' : 'added'}.`)
      this.modal.open = false
      this.modal.type === 'state' ? this.fetchStates() : this.fetchCategories()
    },
    confirmDelete(type, item) { this.deleteTarget = { type, item } },
    async deleteItem() {
      const toast = useToast()
      const table = this.deleteTarget.type === 'state' ? 'states' : 'categories'
      const { error } = await supabase.from(table).delete().eq('id', this.deleteTarget.item.id)
      if (error) { toast.error(error.message); return }
      toast.success(`"${this.deleteTarget.item.name}" deleted.`)
      this.deleteTarget.type === 'state' ? this.fetchStates() : this.fetchCategories()
      this.deleteTarget = null
    }
  },
  mounted() {
    this.fetchStates()
    this.fetchCategories()
  }
}
</script>
