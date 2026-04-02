<template>
  <div class="space-y-6">
    <div v-if="reviews.length === 0" class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500">
      Be the first to leave a review for this place!
    </div>
    <div v-for="review in reviews" :key="review.id" class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="flex items-center space-x-3 mb-2">
        <div class="h-10 w-10 rounded-full bg-indigo-200 dark:bg-indigo-900 flex items-center justify-center text-sm font-semibold text-indigo-800 dark:text-indigo-300">
          {{ review.profiles?.username ? review.profiles.username[0].toUpperCase() : 'U' }}
        </div>
        <div>
          <p class="font-semibold text-gray-800 dark:text-gray-100">{{ review.profiles?.username || 'Anonymous User' }}</p>
          <p class="text-sm text-yellow-500 font-bold">{{ getStars(review.rating) }}</p>
        </div>
      </div>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-2">Reviewed on {{ formatDate(review.created_at) }}</p>
      <p class="text-gray-700 dark:text-gray-300">{{ review.text_content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewList',
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  methods: {
    // Helper to render stars
    getStars(rating) {
      return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    },
    // Simple date formatter
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
      });
    }
  }
}
</script>