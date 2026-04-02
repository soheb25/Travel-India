<template>
  <div
    class="card-3d group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-3d
           ring-1 ring-gray-100 dark:ring-gray-700 hover:ring-indigo-200 dark:hover:ring-indigo-500 duration-300"
  >
    <!-- Image / hero -->
    <router-link :to="`/place/${place.slug}`" class="block relative">
      <div class="relative h-52 bg-gray-100">
      <!-- Skeleton Placeholder -->
      <div v-show="!isImageLoaded && heroImageUrl" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
      <!-- Image -->
      <img
        v-if="heroImageUrl"
        :src="heroImageUrl"
        :alt="`Image of ${place.name}`"
        class="h-full w-full object-cover transition-opacity duration-300"
        :class="{ 'opacity-0': !isImageLoaded, 'opacity-100': isImageLoaded }"
        @load="isImageLoaded = true"
        loading="lazy"
      />
      <!-- Placeholder -->
      <div v-else class="absolute inset-0 flex h-full w-full items-center justify-center text-gray-400">
        <span class="text-sm">No Image</span>
      </div>

        <!-- Overlay linear & shine on hover -->
        <div
          class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent
                 opacity-80 transition-opacity group-hover:opacity-100"
        ></div>
        <div
          class="pointer-events-none absolute -inset-x-10 -top-10 h-20 translate-y-8 bg-white/10 blur-2xl
                 opacity-0 transition group-hover:opacity-100"
        ></div>

        <!-- Top-left: location/state pill -->
        <div class="absolute left-3 top-3">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-800
                   shadow ring-1 ring-gray-200"
          >
            <svg class="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ stateName }}
          </span>
        </div>

        <!-- Top-right: Admin Pick -->
        <div v-if="place.is_verified" class="absolute right-3 top-3">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.9l-4.77 2.31.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
                clip-rule="evenodd"/>
            </svg>
            Admin Pick
          </span>
        </div>
      </div>
    </router-link>

    <!-- Content -->
    <div class="p-5">
      <!-- Title -->
      <div class="mb-2 flex items-start justify-between gap-3">
        <router-link
          :to="`/place/${place.slug}`"
          class="line-clamp-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white transition hover:text-indigo-600 dark:hover:text-indigo-400"
          :title="place.name"
        >
          {{ place.name }}
        </router-link>
      </div>

      <!-- Meta: category + description -->
      <div class="mb-4 text-sm text-gray-500">
        <p class="flex items-center mb-2">
          <svg class="mr-1.5 h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/>
          </svg>
          <span class="line-clamp-1">{{ categoryName }}</span>
        </p>
        <p v-if="place.description" class="line-clamp-2 text-gray-400 dark:text-gray-500 leading-relaxed">
          {{ place.description }}
        </p>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

      <!-- Footer -->
      <div class="mt-4 flex items-center justify-between">
        <!-- Rating -->
        <div class="flex items-center text-sm font-semibold text-yellow-600">
          <div class="flex -space-x-0.5 pr-1">
            <svg v-for="n in 4" :key="'star-full-'+n" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.953L10 0l2.948 5.957 6.562.953-4.755 4.635 1.123 6.545z"/>
            </svg>
            <svg class="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <defs>
                <linearlinear id="half">
                  <stop offset="50%" />
                  <stop offset="50%" stop-color="transparent" />
                </linearlinear>
              </defs>
              <path fill="url(#half)"
                d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.953L10 0l2.948 5.957 6.562.953-4.755 4.635 1.123 6.545z"/>
            </svg>
          </div>
          4.5 <span class="ml-1 text-xs font-normal text-gray-400">(24 reviews)</span>
        </div>

        <!-- Favorite -->
        <button
          @click="onToggleFavorite"
          :class="[
            'p-2 rounded-full transition cursor-pointer duration-150 ring-1',
            isCurrentFavorite
              ? 'text-rose-600 bg-rose-50 ring-rose-100'
              : 'text-gray-500 bg-white hover:text-rose-600 hover:bg-rose-50 ring-gray-200'
          ]"
          :disabled="!isAuthenticated"
          :title="isAuthenticated ? 'Toggle Favorite' : 'Sign in to save'"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" :class="isCurrentFavorite ? '' : 'opacity-80'">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
                 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'pinia';
import { useFavoritesStore } from '@/stores/favorites';
import { useToast } from 'vue-toastification';

export default {
  name: 'PlaceCard',
  props: {
    place: {
      type: Object,
      required: true
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isImageLoaded: false
    }
  },
  computed: {
    isCurrentFavorite() {
      return useFavoritesStore().isFavorite(this.place.id);
    },
    heroImageUrl() {
      // Check if the nested array exists and is not empty
      if (!this.place.place_images || this.place.place_images.length === 0) {
        return null;
      }
      // Find the image marked as hero (is_hero: true)
      const hero = this.place.place_images.find(img => img.is_hero);

      // Return the hero URL, or the first image URL if no hero is marked
      return hero ? hero.url : this.place.place_images[0].url;
    },
    // Extract state and category names from the joined data
    stateName() {
      return this.place.states?.name || 'Unknown State';
    },
    categoryName() {
      return this.place.categories?.name || 'Uncategorized';
    },
  },
  methods: {
    ...mapActions(useFavoritesStore, ['toggleFavorite']),
    onToggleFavorite() {
      if (this.isAuthenticated) {
        this.toggleFavorite(this.place.id);
      } else {
        const toast = useToast();
        toast.warning('Please sign in to save favorites.');
      }
    }
  }
}
</script>
