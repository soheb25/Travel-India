<template>
  <form @submit.prevent="submitReview" class="p-6 bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-600 rounded-xl shadow-inner space-y-4">
    <h3 class="text-xl font-bold text-indigo-800">Leave Your Review</h3>

    <div>
      <label class="block text-sm font-medium text-gray-700">Rating</label>
      <div class="mt-1 flex gap-1">
        <button
          v-for="n in 5" :key="n"
          type="button"
          @click="rating = n"
          class="text-2xl cursor-pointer transition"
          :class="n <= rating ? 'text-yellow-400' : 'text-gray-300'"
        >★</button>
      </div>
    </div>

    <div>
      <label for="reviewText" class="block text-sm font-medium text-gray-700">Your Thoughts</label>
      <textarea
        id="reviewText"
        v-model="reviewText"
        rows="4"
        required
        placeholder="Share your experience..."
        class="mt-1 block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div v-if="error" class="p-2 text-sm text-red-700 bg-red-100 rounded">{{ error }}</div>

    <button
      type="submit"
      :disabled="isSubmitting || !reviewText.length"
      class="w-full py-3 px-4 cursor-pointer rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition"
    >
      {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
    </button>
  </form>
</template>

<script>
import { supabase } from '@/supabase'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ReviewForm',
  props: {
    placeId: { type: String, required: true }
  },
  emits: ['reviewSubmitted'],
  data() {
    return {
      rating: 5,
      reviewText: '',
      isSubmitting: false,
      error: null
    }
  },
  methods: {
    async submitReview() {
      if (this.isSubmitting || !this.reviewText) return
      const toast = useToast()
      this.isSubmitting = true
      this.error = null
      try {
        const { error } = await supabase.from('reviews').insert({
          place_id: this.placeId,
          user_id: useAuthStore().user.id,
          rating: this.rating,
          text_content: this.reviewText
        })
        if (error) throw error
        this.reviewText = ''
        this.rating = 5
        toast.success('Review submitted!')
        this.$emit('reviewSubmitted')
      } catch (err) {
        this.error = err.message || 'Failed to submit review.'
        toast.error(this.error)
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>
