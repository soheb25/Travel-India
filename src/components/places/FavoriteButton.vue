<template>
  <button
    @click="handleClick"
    :disabled="isLoading"
    :title="isFav ? 'Remove from favorites' : 'Save to favorites'"
    class="inline-flex items-center justify-center rounded-full px-3 py-3 ring-1 transition"
    :class="isFav
      ? 'bg-pink-50 text-pink-600 ring-pink-300 hover:bg-pink-100'
      : 'bg-white text-gray-500 ring-gray-200 hover:bg-gray-50 hover:text-pink-500'"
  >
    <svg class="h-5 w-5" viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </button>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'FavoriteButton',
  props: {
    placeId: { type: [String, Number], required: true },
    isAuthenticated: { type: Boolean, default: false }
  },
  computed: {
    ...mapState(useFavoritesStore, ['isLoading']),
    isFav() {
      return useFavoritesStore().isFavorite(this.placeId)
    }
  },
  methods: {
    ...mapActions(useFavoritesStore, ['toggleFavorite']),
    handleClick() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: 'SignIn' })
        return
      }
      this.toggleFavorite(this.placeId)
    }
  }
}
</script>
