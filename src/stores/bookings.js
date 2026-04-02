import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    bookings: [],
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchUserBookings() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id, visit_date, num_visitors, total_price,
            visitor_type, status, created_at,
            places(id, name, slug, place_images(url, is_hero))
          `)
          .eq('user_id', authStore.user.id)
          .order('visit_date', { ascending: false })
        if (error) throw error
        this.bookings = data
      } catch (err) {
        this.error = err.message
        console.error('[bookings] fetchUserBookings:', err)
      } finally {
        this.isLoading = false
      }
    },

    async createBooking({ placeId, visitDate, numVisitors, totalPrice, visitorType }) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.error = 'You must be signed in to book.'
        return false
      }
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            user_id: authStore.user.id,
            place_id: placeId,
            visit_date: visitDate,
            num_visitors: numVisitors,
            total_price: totalPrice,
            visitor_type: visitorType,
            status: 'confirmed'
          })
          .select()  // return inserted row to confirm it was saved

        if (error) throw error
        if (!data || data.length === 0) throw new Error('Booking was not saved. Please try again.')

        await this.fetchUserBookings()
        return true
      } catch (err) {
        this.error = err.message
        console.error('[bookings] createBooking:', err)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async cancelBooking(bookingId) {
      this.isLoading = true
      this.error = null
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId)
        if (error) throw error
        const b = this.bookings.find(b => b.id === bookingId)
        if (b) b.status = 'cancelled'
      } catch (err) {
        this.error = err.message
        console.error('[bookings] cancelBooking:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
