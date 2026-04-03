<template>
  <div class="max-w-3xl mx-auto space-y-8">

    <!-- Loading -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-48 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-32 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
    </div>

    <template v-else-if="booking">

      <!-- Success Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-600 p-6 text-white shadow-3d">
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div class="relative flex items-center gap-4">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow">
            🎉
          </div>
          <div>
            <h1 class="text-2xl font-extrabold">Booking Confirmed!</h1>
            <p class="mt-0.5 text-white/80 text-sm">Your journey to <span class="font-bold text-white">{{ booking.places?.name }}</span> is all set.</p>
            <p class="mt-1 text-xs text-white/60">Booking ID: <span class="font-mono font-semibold text-white/80">{{ booking.id?.slice(0, 8).toUpperCase() }}</span></p>
          </div>
        </div>
      </div>

      <!-- Journey Summary Card -->
      <div class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          🗺️ Your Journey Details
        </h2>

        <!-- Place hero image -->
        <div v-if="heroImage" class="mb-5 h-52 w-full overflow-hidden rounded-xl">
          <img :src="heroImage" :alt="booking.places?.name" class="h-full w-full object-cover" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-4">
            <p class="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">Destination</p>
            <p class="mt-1 text-lg font-bold text-indigo-900 dark:text-indigo-200">{{ booking.places?.name }}</p>
          </div>
          <div class="rounded-xl bg-purple-50 dark:bg-purple-900/30 p-4">
            <p class="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wide">Visit Date</p>
            <p class="mt-1 text-lg font-bold text-purple-900 dark:text-purple-200">{{ formatDate(booking.visit_date) }}</p>
          </div>
          <div class="rounded-xl bg-pink-50 dark:bg-pink-900/30 p-4">
            <p class="text-xs font-semibold text-pink-500 dark:text-pink-400 uppercase tracking-wide">Visitors</p>
            <p class="mt-1 text-lg font-bold text-pink-900 dark:text-pink-200">{{ booking.num_visitors }} {{ booking.num_visitors === 1 ? 'Person' : 'People' }}</p>
          </div>
          <div class="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p class="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wide">Amount Paid</p>
            <p class="mt-1 text-lg font-bold text-emerald-900 dark:text-emerald-200">
              {{ booking.total_price > 0 ? '₹' + booking.total_price : 'FREE' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Place Info from DB -->
      <div v-if="place" class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 space-y-5">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          📋 About Your Destination
        </h2>

        <p v-if="place.history_snippet" class="border-l-4 border-indigo-400 pl-4 text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
          {{ place.history_snippet }}
        </p>
        <p v-if="place.description" class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
          {{ place.description }}
        </p>

        <!-- Quick facts -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div v-if="place.opening_hours" class="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-700 p-3">
            <span class="text-xl">🕐</span>
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">Opening Hours</p>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ place.opening_hours }}</p>
            </div>
          </div>
          <div v-if="place.best_time_to_visit" class="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-700 p-3">
            <span class="text-xl">🌤️</span>
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">Best Time</p>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ place.best_time_to_visit }}</p>
            </div>
          </div>
          <div v-if="place.entry_fee" class="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-700 p-3">
            <span class="text-xl">🎫</span>
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">Entry Fee</p>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ place.entry_fee }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Travel Tips -->
      <div class="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6">
        <h2 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-4 flex items-center gap-2">
          💡 Travel Tips
        </h2>
        <ul class="space-y-2">
          <li v-for="tip in travelTips" :key="tip" class="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
            <span class="mt-0.5 text-amber-500">✓</span>
            {{ tip }}
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <router-link :to="`/place/${booking.places?.slug}`"
          class="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow">
          🏛️ View Place Details
        </router-link>
        <router-link :to="{ name: 'Profile', query: { tab: 'bookings' } }"
          class="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          🎟️ My Bookings
        </router-link>
        <router-link to="/"
          class="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          🔍 Explore More
        </router-link>
      </div>

    </template>

    <!-- Not found -->
    <div v-else class="text-center py-16">
      <p class="text-gray-500 dark:text-gray-400">Booking not found.</p>
      <router-link to="/" class="mt-4 inline-block px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Go Home</router-link>
    </div>

  </div>
</template>

<script>
import { supabase } from '@/supabase'
import { useBookingsStore } from '@/stores/bookings'

export default {
  name: 'BookingConfirmation',
  data() {
    return {
      booking: null,
      place: null,
      isLoading: true
    }
  },
  computed: {
    heroImage() {
      const images = this.place?.place_images
      if (!images?.length) return null
      return images.find(i => i.is_hero)?.url || images[0].url
    },
    travelTips() {
      const tips = [
        'Carry a valid government-issued photo ID for entry.',
        'Arrive 15–20 minutes early to avoid queues.',
        'Carry sufficient water and wear comfortable footwear.',
        'Photography rules may apply — check at the entrance.',
        'Keep your booking confirmation handy on your phone.',
      ]
      if (this.place?.best_time_to_visit) {
        tips.push(`Best time to visit: ${this.place.best_time_to_visit}`)
      }
      if (this.place?.opening_hours) {
        tips.push(`Opening hours: ${this.place.opening_hours}`)
      }
      return tips
    }
  },
  methods: {
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
    async loadBooking() {
      const bookingId = this.$route.params.bookingId

      // Try from store first
      const store = useBookingsStore()
      let booking = store.bookings.find(b => b.id === bookingId)

      // Fallback: fetch from Supabase
      if (!booking) {
        const { data } = await supabase
          .from('bookings')
          .select(`id, visit_date, num_visitors, total_price, visitor_type, status,
            places(id, name, slug, description, history_snippet, entry_fee, opening_hours, best_time_to_visit,
              place_images(url, is_hero))`)
          .eq('id', bookingId)
          .single()
        booking = data
      }

      this.booking = booking

      // Load full place details if not already embedded
      if (booking?.places?.id) {
        const { data: place } = await supabase
          .from('places')
          .select('id, name, slug, description, history_snippet, entry_fee, opening_hours, best_time_to_visit, place_images(url, is_hero)')
          .eq('id', booking.places.id)
          .single()
        this.place = place
      }

      this.isLoading = false
    }
  },
  mounted() {
    this.loadBooking()
  }
}
</script>
