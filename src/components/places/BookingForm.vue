<template>
  <div class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
    <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Book a Visit</h3>

    <!-- Not logged in -->
    <div v-if="!isAuthenticated" class="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 text-yellow-800">
      Please <router-link to="/signin" class="font-semibold underline">sign in</router-link> to book tickets.
    </div>

    <!-- Free entry -->
    <div v-else-if="isFree" class="space-y-4">
      <div class="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-3 text-sm text-emerald-800 dark:text-emerald-300 font-medium">
        🎉 Entry is <span class="font-bold">FREE</span> for this place!
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Visit Date</label>
        <input v-model="visitDate" type="date" :min="today" required
          class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Visitors</label>
        <input v-model.number="numVisitors" type="number" min="1" max="20" required
          class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div v-if="bookingError" class="rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{{ bookingError }}</div>
      <button @click.prevent="handleBooking" :disabled="isLoading || !visitDate"
        class="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow hover:bg-emerald-700 disabled:bg-gray-400 transition">
        {{ isLoading ? 'Booking...' : 'Plan My Visit' }}
      </button>
    </div>

    <!-- Paid entry -->
    <form v-else @submit.prevent="handleBooking" class="space-y-4">

      <!-- Visitor Type toggle — only show if prices differ -->
      <div v-if="entryFee.indian !== entryFee.foreigner">
        <label class="block text-sm font-medium text-gray-700 mb-1">Visitor Type</label>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" @click="visitorType = 'indian'"
            class="rounded-lg border-2 px-3 py-2 text-sm font-semibold transition cursor-pointer"
            :class="visitorType === 'indian'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:border-indigo-300'">
            🇮🇳 Indian
            <span class="block text-xs font-normal mt-0.5">₹{{ entryFee.indian }} / person</span>
          </button>
          <button type="button" @click="visitorType = 'foreigner'"
            class="rounded-lg border-2 px-3 py-2 text-sm font-semibold transition cursor-pointer"
            :class="visitorType === 'foreigner'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:border-indigo-300'">
            🌍 Foreigner
            <span class="block text-xs font-normal mt-0.5">₹{{ entryFee.foreigner }} / person</span>
          </button>
        </div>
      </div>

      <!-- Visit Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Visit Date</label>
        <input v-model="visitDate" type="date" :min="today" required
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <!-- Number of Visitors -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Number of Visitors</label>
        <input v-model.number="numVisitors" type="number" min="1" max="20" required
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <!-- Price Summary -->
      <div class="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800 space-y-1">
        <div class="flex justify-between items-center">
          <span>₹{{ selectedFee }} × {{ numVisitors }} {{ numVisitors === 1 ? 'visitor' : 'visitors' }}</span>
          <span class="text-base font-bold">₹{{ totalPrice }}</span>
        </div>
        <div class="text-xs text-indigo-500">
          {{ entryFee.indian !== entryFee.foreigner
            ? (visitorType === 'indian' ? '🇮🇳 Indian rate' : '🌍 Foreign national rate')
            : '🎫 Standard rate' }}
        </div>
      </div>

      <div v-if="bookingError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ bookingError }}</div>

      <button type="submit" :disabled="isLoading"
        class="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow hover:bg-indigo-700 disabled:bg-indigo-400 transition">
        {{ isLoading ? 'Booking...' : 'Book Now' }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useBookingsStore } from '@/stores/bookings'
import { useToast } from 'vue-toastification'

export default {
  name: 'BookingForm',
  props: {
    placeId: { type: String, required: true },
    placeName: { type: String, default: '' },
    entryFee: { type: Object, default: null },
    isAuthenticated: { type: Boolean, default: false }
  },
  emits: ['booked'],
  data() {
    return {
      visitDate: '',
      numVisitors: 1,
      visitorType: 'indian',
      bookingError: null
    }
  },
  computed: {
    ...mapState(useBookingsStore, ['isLoading']),
    isFree() {
      return !this.entryFee
    },
    today() {
      return new Date().toISOString().split('T')[0]
    },
    selectedFee() {
      if (this.isFree) return 0
      return this.visitorType === 'indian' ? this.entryFee.indian : this.entryFee.foreigner
    },
    totalPrice() {
      return this.selectedFee * this.numVisitors
    }
  },
  methods: {
    ...mapActions(useBookingsStore, ['createBooking']),
    async handleBooking() {
      const toast = useToast()
      this.bookingError = null

      if (!this.visitDate) {
        this.bookingError = 'Please select a visit date.'
        return
      }

      // For free entry — save directly and go to confirmation
      if (this.isFree) {
        const success = await this.createBooking({
          placeId: this.placeId,
          visitDate: this.visitDate,
          numVisitors: this.numVisitors,
          totalPrice: 0,
          visitorType: 'free'
        })
        if (success) {
          const store = useBookingsStore()
          const booking = store.bookings[0]
          toast.success('Visit planned successfully!')
          this.$emit('booked')
          this.$router.push({ name: 'BookingConfirmation', params: { bookingId: booking.id } })
        } else {
          this.bookingError = useBookingsStore().error || 'Booking failed.'
          toast.error(this.bookingError)
        }
        return
      }

      // For paid entry — go to payment page with booking details as state
      this.$router.push({
        name: 'Payment',
        state: {
          placeId: this.placeId,
          visitDate: this.visitDate,
          numVisitors: this.numVisitors,
          totalPrice: this.totalPrice,
          visitorType: this.visitorType,
          placeName: this.placeName
        }
      })
    }
  }
}
</script>
