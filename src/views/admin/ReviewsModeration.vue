<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-gray-800">Reviews Moderation</h2>

    <div v-if="isLoading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-20 rounded-xl bg-gray-100 animate-pulse"></div>
    </div>

    <div v-else-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{{ error }}</div>

    <div v-else-if="reviews.length === 0" class="text-center py-12 text-gray-400">
      <div class="text-4xl mb-2">✅</div>
      <p class="font-medium">No pending reviews.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="review in reviews" :key="review.id"
        class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-2">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 truncate">
              {{ review.places?.name || 'Unknown Place' }}
            </p>
            <p class="text-xs text-gray-400">
              by {{ review.profiles?.username || 'Anonymous' }} ·
              {{ formatDate(review.created_at) }} ·
              {{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}
            </p>
          </div>
          <span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="review.is_moderated
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'">
            {{ review.is_moderated ? 'Approved' : 'Pending' }}
          </span>
        </div>

        <p class="text-sm text-gray-600 line-clamp-3">{{ review.text_content }}</p>

        <div class="flex gap-2 pt-1">
          <button v-if="!review.is_moderated" @click="approveReview(review)"
            class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
            ✓ Approve
          </button>
          <button @click="confirmDelete(review)"
            class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-900">Delete this review?</h3>
        <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ deleteTarget.text_content }}</p>
        <div class="mt-5 flex gap-3">
          <button @click="deleteTarget = null"
            class="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button @click="deleteReview"
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
  name: 'ReviewsModeration',
  data() {
    return { reviews: [], isLoading: false, error: null, deleteTarget: null }
  },
  methods: {
    async fetchReviews() {
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, text_content, is_moderated, created_at, places(name), profiles(username)')
          .order('created_at', { ascending: false })
        if (error) throw error
        this.reviews = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
    async approveReview(review) {
      const toast = useToast()
      const { error } = await supabase.from('reviews').update({ is_moderated: true }).eq('id', review.id)
      if (error) { toast.error(error.message); return }
      review.is_moderated = true
      toast.success('Review approved.')
    },
    confirmDelete(review) { this.deleteTarget = review },
    async deleteReview() {
      const toast = useToast()
      const { error } = await supabase.from('reviews').delete().eq('id', this.deleteTarget.id)
      if (error) { toast.error(error.message); return }
      this.reviews = this.reviews.filter(r => r.id !== this.deleteTarget.id)
      toast.success('Review deleted.')
      this.deleteTarget = null
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  },
  mounted() { this.fetchReviews() }
}
</script>
