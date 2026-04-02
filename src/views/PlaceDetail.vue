<template>
  <!-- Error state: only show after load attempt with no result -->
  <div v-if="!placeData && !initialLoad && !isDetailLoading" class="text-center py-24">
    <h1 class="text-2xl font-bold text-red-600">Error: Place not found.</h1>
    <p class="mt-2 text-sm text-gray-500">Please go back and try a different place.</p>
  </div>

  <div v-else class="space-y-12">
    <!-- Loading skeleton -->
    <div v-if="isDetailLoading || !placeData" class="animate-pulse space-y-5">
      <div class="relative h-96 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden"></div>
      <div class="h-8 w-2/3 rounded bg-gray-300"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div class="h-5 w-5/6 rounded bg-gray-200"></div>
          <div class="h-5 w-1/2 rounded bg-gray-200"></div>
          <div class="h-40 rounded bg-gray-200"></div>
        </div>
        <div class="space-y-4">
          <div class="h-28 rounded bg-gray-200"></div>
          <div class="h-28 rounded bg-gray-200"></div>
          <div class="h-28 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="mx-auto max-w-7xl">
      <!-- HERO -->
      <section class="mb-10">
        <div class="relative h-96 overflow-hidden rounded-2xl shadow-3d ring-1 ring-gray-200">
          <img
            v-if="heroImages.length"
            :src="heroImages[0].url"
            :alt="placeData.name"
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <div v-else class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No Images Available
          </div>
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          <div class="absolute bottom-4 left-4">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
              {{ heroImages.length }} Photos
            </span>
          </div>
        </div>

        <!-- Title Bar -->
        <div class="mt-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-end">
          <div>
            <h1 class="flex items-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 md:text-5xl">
              {{ placeData.name }}
              <span v-if="placeData.is_verified"
                class="ml-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold tracking-wide text-white shadow">
                VERIFIED
              </span>
            </h1>
            <p class="mt-2 text-lg text-indigo-600">
              {{ placeData.states.name }}
              <span class="mx-2 text-gray-300">/</span>
              <span class="text-gray-700">{{ placeData.categories?.name }}</span>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <FavoriteButton :placeId="placeData.id" :isAuthenticated="isAuthenticated" />
            <button
              class="btn-3d inline-flex items-center justify-center rounded-full bg-white px-3 py-3 text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50"
              title="Share"
              @click="sharePlace"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 8a3 3 0 100-6 3 3 0 000 6zm-9 8a3 3 0 100-6 3 3 0 000 6zm9 8a3 3 0 100-6 3 3 0 000 6zM8.59 9.17l6.83-3.9M8.59 14.83l6.83 3.9" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- MAIN GRID -->
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <!-- Left -->
        <section class="space-y-10 lg:col-span-2">
          <div class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <h2 class="mb-4 text-2xl font-bold text-indigo-700 dark:text-indigo-400 md:text-3xl">History & Overview</h2>
            <p v-if="placeData.history_snippet"
              class="mb-4 border-l-4 border-indigo-300 dark:border-indigo-600 pl-4 text-lg italic leading-relaxed text-gray-600 dark:text-gray-300">
              {{ placeData.history_snippet }}
            </p>
            <p class="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">{{ placeData.description }}</p>
          </div>

          <!-- Reviews -->
          <div id="reviews" class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <h2 class="text-2xl font-bold text-indigo-700 md:text-3xl">
                User Reviews ({{ placeData.reviews.length }})
              </h2>
              <div class="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-700 ring-1 ring-yellow-200">
                ⭐ {{ averageRating }}
              </div>
            </div>
            <div class="space-y-8">
              <ReviewForm v-if="isAuthenticated" :placeId="placeData.id" @reviewSubmitted="onReviewSubmitted" />
              <p v-else class="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 text-yellow-800">
                Please sign in to add your rating and review.
              </p>
              <ReviewList :reviews="placeData.reviews" />
            </div>
          </div>
        </section>

        <!-- Right / Sidebar -->
        <aside class="space-y-8">
          <BookingForm :placeId="placeData.id" :entryFee="entryFeeNumber" :isAuthenticated="isAuthenticated" />

          <WeatherWidget
            :lat="placeData.latitude"
            :lng="placeData.longitude"
            :placeName="placeData.name"
          />

          <div class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Quick Facts</h3>
            <ul class="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              <li class="flex items-center justify-between py-2">
                <span class="font-medium">Entry Fee</span>
                <span class="font-semibold text-indigo-600">{{ placeData.entry_fee || 'Free' }}</span>
              </li>
              <li class="flex items-center justify-between py-2">
                <span class="font-medium">Opening Hours</span>
                <span>{{ placeData.opening_hours || 'Check locally' }}</span>
              </li>
              <li class="flex items-center justify-between py-2">
                <span class="font-medium">Best Time</span>
                <span>{{ placeData.best_time_to_visit || 'Year-round' }}</span>
              </li>
            </ul>
          </div>

          <div class="rounded-2xl sticky bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-200">Location</h3>
            <div class="overflow-hidden rounded-xl ring-1 ring-gray-200">
              <DetailMap :lat="placeData.latitude" :lng="placeData.longitude" :placeName="placeData.name" />
            </div>
            <p class="mt-4 text-xs text-gray-500">
              Lat: {{ placeData.latitude }}, Lng: {{ placeData.longitude }}
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { usePlacesStore } from '@/stores/places';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

import FavoriteButton from '@/components/places/FavoriteButton.vue';
import BookingForm from '@/components/places/BookingForm.vue';
import WeatherWidget from '@/components/places/WeatherWidget.vue';
import ReviewList from '@/components/reviews/ReviewList.vue';
import ReviewForm from '@/components/reviews/ReviewForm.vue';
import DetailMap from '@/components/places/DetailMap.vue';

export default {
  name: 'PlaceDetail',
  components: { FavoriteButton, BookingForm, WeatherWidget, ReviewList, ReviewForm, DetailMap },
  data() {
    return { placeData: null, initialLoad: true };
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),
    ...mapState(usePlacesStore, ['isDetailLoading']),
    heroImages() {
      if (!this.placeData?.place_images) return [];
      return [...this.placeData.place_images].sort((a, b) => {
        if (a.is_hero === b.is_hero) return (a.sort_order || 0) - (b.sort_order || 0);
        return a.is_hero ? -1 : 1;
      });
    },
    averageRating() {
      if (!this.placeData?.reviews?.length) return '—';
      const total = this.placeData.reviews.reduce((sum, r) => sum + r.rating, 0);
      return (total / this.placeData.reviews.length).toFixed(1);
    },
    entryFeeNumber() {
      const fee = this.placeData?.entry_fee;
      if (!fee) return null;
      const str = String(fee).trim();

      // Free entry
      if (/^free$/i.test(str) || /no.?entry/i.test(str) || /^0$/.test(str)) return null;

      const numbers = [...str.matchAll(/(\d+)/g)].map(m => parseInt(m[1]));
      if (numbers.length === 0) return null;

      const indianMatch = str.match(/(?:indian[s]?\s*[:\-]?\s*)[₹Rs\.\s]*(\d+)/i);
      const foreignerMatch = str.match(/(?:foreigner[s]?\s*[:\-]?\s*)[₹Rs\.\s]*(\d+)/i);

      if (indianMatch && foreignerMatch) {
        return { indian: parseInt(indianMatch[1]), foreigner: parseInt(foreignerMatch[1]) };
      }
      if (numbers.length >= 2) {
        return { indian: numbers[0], foreigner: numbers[1] };
      }
      return { indian: numbers[0], foreigner: numbers[0] };
    }
  },
  watch: {
    '$route.params.slug': { handler: 'loadPlaceData', immediate: true }
  },
  methods: {
    ...mapActions(usePlacesStore, ['fetchPlaceBySlug']),
    async loadPlaceData(slug) {
      if (!slug) return;
      this.placeData = null;
      const place = await this.fetchPlaceBySlug(slug);
      if (place) this.placeData = place;
      this.initialLoad = false;
    },
    async onReviewSubmitted() {
      const place = await this.fetchPlaceBySlug(this.$route.params.slug);
      if (place) this.placeData = place;
    },
    sharePlace() {
      const toast = useToast();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    }
  },
  beforeUnmount() {
    // Unhead automatically cleans up tags when component is destroyed
  }
};
</script>
