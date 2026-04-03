<template>
  <div class="max-w-lg mx-auto space-y-6">

    <!-- Header -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 shadow-lg mb-4">
        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Complete Payment</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">Secure checkout for your visit</p>
    </div>

    <!-- No booking data guard -->
    <div v-if="!bookingData.placeId" class="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
      <p class="text-gray-500 dark:text-gray-400">No booking data found.</p>
      <button @click="$router.back()" class="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Go Back</button>
    </div>

    <template v-else>
      <!-- Order Summary -->
      <div class="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Order Summary</h2>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">📍 Destination</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ bookingData.placeName }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">📅 Visit Date</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ formatDate(bookingData.visitDate) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">👥 Visitors</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ bookingData.numVisitors }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">🎫 Visitor Type</span>
            <span class="font-semibold text-gray-900 dark:text-white capitalize">{{ bookingData.visitorType === 'indian' ? '🇮🇳 Indian' : '🌍 Foreigner' }}</span>
          </div>
          <div class="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between">
            <span class="font-bold text-gray-900 dark:text-white">Total Amount</span>
            <span class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{{ bookingData.totalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Payment Method</h2>
        <div class="space-y-3">
          <label v-for="method in paymentMethods" :key="method.id"
            class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition"
            :class="selectedMethod === method.id
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'">
            <input type="radio" :value="method.id" v-model="selectedMethod" class="accent-indigo-600" />
            <span class="text-xl">{{ method.icon }}</span>
            <div class="flex-grow">
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ method.name }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">{{ method.desc }}</p>
            </div>
            <span v-if="method.id === 'upi'" class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Recommended</span>
          </label>
        </div>

        <!-- UPI ID input -->
        <div v-if="selectedMethod === 'upi'" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UPI ID</label>
          <input v-model="upiId" type="text" placeholder="yourname@upi"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-200 transition" />
        </div>

        <!-- Card inputs -->
        <div v-if="selectedMethod === 'card'" class="mt-4 space-y-3">
          <input v-model="cardNumber" type="text" placeholder="Card Number (16 digits)" maxlength="19"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:border-indigo-500 transition" />
          <div class="grid grid-cols-2 gap-3">
            <input v-model="cardExpiry" type="text" placeholder="MM/YY" maxlength="5"
              class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:border-indigo-500 transition" />
            <input v-model="cardCvv" type="password" placeholder="CVV" maxlength="3"
              class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:border-indigo-500 transition" />
          </div>
        </div>
      </div>

      <!-- Pay button -->
      <button @click="processPayment" :disabled="isProcessing"
        class="w-full rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center justify-center gap-3">
        <svg v-if="isProcessing" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/>
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        {{ isProcessing ? 'Processing Payment...' : `Pay ₹${bookingData.totalPrice} Securely` }}
      </button>

      <p class="text-center text-xs text-gray-400 dark:text-gray-500">
        🔒 256-bit SSL encrypted · Your payment is 100% secure
      </p>
    </template>
  </div>
</template>

<script>
import { useBookingsStore } from '@/stores/bookings'
import { useToast } from 'vue-toastification'
import { mapActions } from 'pinia'

export default {
  name: 'Payment',
  data() {
    return {
      selectedMethod: 'upi',
      upiId: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      isProcessing: false,
      paymentMethods: [
        { id: 'upi',    icon: '📱', name: 'UPI',         desc: 'Pay via any UPI app' },
        { id: 'card',   icon: '💳', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
        { id: 'wallet', icon: '👛', name: 'Wallet',      desc: 'Paytm, PhonePe, Amazon Pay' },
        { id: 'netbanking', icon: '🏦', name: 'Net Banking', desc: 'All major banks supported' },
      ]
    }
  },
  computed: {
    // Read booking data passed via router state
    bookingData() {
      return history.state || {}
    }
  },
  methods: {
    ...mapActions(useBookingsStore, ['createBooking']),
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
    async processPayment() {
      const toast = useToast()
      this.isProcessing = true

      // Simulate payment processing delay
      await new Promise(r => setTimeout(r, 2000))

      // Save booking to Supabase
      const success = await this.createBooking({
        placeId: this.bookingData.placeId,
        visitDate: this.bookingData.visitDate,
        numVisitors: this.bookingData.numVisitors,
        totalPrice: this.bookingData.totalPrice,
        visitorType: this.bookingData.visitorType
      })

      this.isProcessing = false

      if (success) {
        toast.success('🎉 Payment Successful! Your booking is confirmed.')
        const store = useBookingsStore()
        const booking = store.bookings[0]
        // Redirect to journey detail page
        this.$router.push({
          name: 'BookingConfirmation',
          params: { bookingId: booking.id }
        })
      } else {
        toast.error('Payment failed. Please try again.')
      }
    }
  }
}
</script>
