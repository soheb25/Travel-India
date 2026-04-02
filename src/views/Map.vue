<template>
  <div class="relative flex h-[80vh] w-full">

    <!-- ===== Dim overlay when sheet is open (mobile only) ===== -->
    <div
      v-if="selectedPlace"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
      @click="clearSelection"
    ></div>

    <!-- ===== MAP WRAPPER ===== -->
    <div
      :class="[
        'relative h-full transition-all duration-300',
        selectedPlace ? 'lg:w-2/3 lg:pr-3 w-full' : 'w-full'
      ]"
    >
      <!-- Loading overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 z-20 flex items-center justify-center rounded-2xl
               bg-white/70 backdrop-blur-sm"
      >
        <div class="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-2 text-indigo-700 shadow ring-1 ring-indigo-100">
          <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/>
          </svg>
          <span class="font-semibold">Loading map data…</span>
        </div>
      </div>

      <!-- Make sure the map is a low z-layer -->
      <div class="relative h-full rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden z-0">
        <l-map
          ref="map"
          :zoom="mapZoom"
          :center="mapCenter"
          :use-global-leaflet="false"
          class="h-full w-full"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

          <l-marker
            v-for="place in mapPlaces"
            :key="place.id"
            :lat-lng="[place.latitude, place.longitude]"
            :icon="defaultIcon"
            @click="handleMarkerClick(place)"
          >
            <l-popup>
              <div class="max-w-[220px]">
                <div class="mb-2 text-base font-bold text-gray-900">
                  {{ place.name }}
                </div>
                <router-link
                  :to="`/place/${place.slug}`"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  View Details
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </router-link>
              </div>
            </l-popup>
          </l-marker>
        </l-map>

        <!-- Decorative glow -->
        <div aria-hidden="true" class="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-indigo-200/30 blur-2xl"></div>
        <div aria-hidden="true" class="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-pink-200/30 blur-2xl"></div>
      </div>
    </div>

    <!-- ===== SIDE PANEL: bottom sheet on mobile, side on desktop ===== -->
    <div
      v-if="selectedPlace"
      class="lg:w-1/3 lg:pl-3"
    >
      <div
        class="
          lg:static lg:rounded-2xl lg:shadow-2xl lg:ring-1 lg:ring-gray-200 dark:lg:ring-gray-700 lg:h-full
          fixed inset-x-0 bottom-0 z-40 overflow-y-auto
          overflow-hidden rounded-t-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700
        ">
        <!-- Handle (mobile only) -->
        <div class="lg:hidden flex justify-center pt-2">
          <span class="h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></span>
        </div>
        <!-- Sticky header -->
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-6 py-4 backdrop-blur">
          <div class="min-w-0">
            <h2 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ selectedPlace.name }}</h2>
            <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
              {{ selectedPlace.states?.name }} • {{ selectedPlace.categories?.name }}
            </p>
          </div>
          <button @click="clearSelection"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200 transition"
            aria-label="Close details">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Image hero -->
        <div class="px-6 pt-3">
          <div class="relative h-44 w-full overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
            <img
              v-if="selectedPlaceImageUrl"
              :src="selectedPlaceImageUrl"
              :alt="`Image of ${selectedPlace.name}`"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-400">
              [No Hero Image Available]
            </div>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

            <div
              v-if="selectedPlace.is_verified"
              class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.9l-4.77 2.31.91-5.32L2.27 7.12l5.34-.78L10 1.5z" clip-rule="evenodd"/>
              </svg>
              Admin Pick
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {{ selectedPlace?.description || '—' }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300">
              <svg class="h-3.5 w-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ selectedPlace.states?.name || '—' }}
            </span>
            <span class="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300">
              <svg class="h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/>
              </svg>
              {{ selectedPlace.categories?.name || '—' }}
            </span>
          </div>
        </div>

        <!-- CTA -->
        <div class="border-t border-gray-100 px-6 py-5">
          <router-link
            :to="`/place/${selectedPlace.slug}`"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-semibold text-white shadow hover:bg-indigo-700 transition"
          >
            Explore Details
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"/>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { mapState, mapActions } from 'pinia'
import { usePlacesStore } from '@/stores/places'

// 1. Import Vue Leaflet Components
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  // LIcon 
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';


// Note: For marker clustering, you would typically install and import:
// import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
// import LMarkerClusterGroup from 'vue-leaflet-markercluster'; // Or similar Vue wrapper

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    // LMarkerClusterGroup // Placeholder for clustering
  },
  data() {
    return {
      // Set a default center near the geographical center of India
      mapCenter: [20.5937, 78.9629],
      mapZoom: 5,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      // State for the preview sidebar
      selectedPlace: null,
      mapPlaces: [],
      // Custom icon settings
      defaultIcon: null
    };
  },
  computed: {
    // Map places data from the Pinia store
    ...mapState(usePlacesStore, ['isLoading']),

    selectedPlaceImageUrl() {
      const place = this.selectedPlace;
      if (!place || !place.place_images || place.place_images.length === 0) {
        return null;
      }

      // Try to find the image marked as hero (is_hero: true)
      const hero = place.place_images.find(img => img.is_hero);

      // Return the hero URL, or the first image URL as a fallback
      return hero ? hero.url : place.place_images[0].url;
    }
  },
  methods: {
    ...mapActions(usePlacesStore, ['fetchAllForMap']),

    handleMarkerClick(place) {
      this.selectedPlace = place;
      // Optional: Pan the map to the selected marker
      // this.$refs.map.leafletObject.setView([place.latitude, place.longitude], 10);
    },

    // Clear the sidebar
    clearSelection() {
      this.selectedPlace = null;
    }
  },
  async mounted() {
    this.defaultIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    // Ensure places data is loaded when navigating directly to the map view
    this.mapPlaces = await this.fetchAllForMap();
  }
};
</script>

<style scoped>
/* Ensure the map occupies the full height of its container */
.h-full {
  height: 100%;
}
</style>