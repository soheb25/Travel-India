// src/stores/favorites.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoritePlaceIds: [], // plain array — Pinia tracks this reactively
    isLoading: false,
    error: null
  }),
  getters: {
    isFavorite: (state) => (placeId) => state.favoritePlaceIds.includes(placeId),
    favoriteCount: (state) => state.favoritePlaceIds.length
  },
  actions: {
    async fetchUserFavorites() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return
      this.isLoading = true
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('place_id')
          .eq('user_id', authStore.user.id)
        if (error) throw error
        this.favoritePlaceIds = data.map(f => f.place_id)
      } catch (err) {
        this.error = 'Failed to load favorites.'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async toggleFavorite(placeId) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      const isFav = this.favoritePlaceIds.includes(placeId)

      // Optimistic update
      if (isFav) {
        this.favoritePlaceIds = this.favoritePlaceIds.filter(id => id !== placeId)
      } else {
        this.favoritePlaceIds = [...this.favoritePlaceIds, placeId]
      }

      try {
        if (isFav) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', authStore.user.id)
            .eq('place_id', placeId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({ user_id: authStore.user.id, place_id: placeId })
          if (error) throw error
        }
      } catch (err) {
        // Rollback
        if (isFav) {
          this.favoritePlaceIds = [...this.favoritePlaceIds, placeId]
        } else {
          this.favoritePlaceIds = this.favoritePlaceIds.filter(id => id !== placeId)
        }
        this.error = 'Failed to update favorite.'
        console.error(err)
      }
    }
  }
})
