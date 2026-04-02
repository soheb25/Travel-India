<template>
  <div class="max-w-5xl mx-auto space-y-10">
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-2xl border border-indigo-100 shadow-lg">
      <div class="absolute inset-0 -z-10 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
      <div class="px-6 py-10 sm:px-8 sm:py-12 text-white">
        <h1 class="text-4xl font-extrabold tracking-tight drop-shadow-sm">My Profile</h1>
        <p class="mt-2 text-white/80">Manage your account, favorites, bookings and reviews.</p>
        <div class="mt-6 inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur">
          <span class="text-sm">⭐ {{ favoritePlaceIds.length }} Favorites</span>
          <span class="mx-2 h-4 w-px bg-white/30"></span>
          <span class="text-sm">🎟️ {{ bookings.length }} Bookings</span>
          <span class="mx-2 h-4 w-px bg-white/30"></span>
          <span class="truncate max-w-[180px] text-sm text-white/90">{{ user?.email }}</span>
        </div>
      </div>
    </section>

    <!-- Account card -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-indigo-900/50 shadow-xl">
      <!-- Avatar -->
      <div class="md:col-span-1 flex flex-col items-center space-y-5">
        <div class="relative">
          <div v-if="avatarUrl" class="h-32 w-32 rounded-full overflow-hidden ring-4 ring-indigo-200 shadow">
            <img :src="avatarUrl" alt="User Avatar" class="h-full w-full object-cover" />
          </div>
          <div v-else class="h-32 w-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-5xl font-bold ring-4 ring-indigo-200 shadow">
            {{ initials }}
          </div>
          <span class="absolute -right-1 bottom-3 inline-block h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white"></span>
        </div>
        <label class="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100 transition">
          📷 Change Avatar
          <input type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
        </label>
      </div>

      <!-- Details -->
      <div class="md:col-span-2 space-y-5">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Account Details</h2>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <div class="mt-1 flex gap-2">
            <input id="username" v-model="newUsername" type="text"
              class="grow rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Your display name" />
            <button @click="updateUsername" :disabled="newUsername === profile?.username"
              class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-700 disabled:bg-gray-400 transition">
              Save
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (Read-Only)</label>
          <div class="mt-1 flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
            <p class="truncate text-gray-700 dark:text-gray-300">{{ user?.email }}</p>
          </div>
        </div>
        <button @click="handleSignOut"
          class="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-white font-medium shadow hover:bg-red-700 transition">
          Sign Out
        </button>
      </div>
    </section>

    <!-- Tabs -->
    <section>
      <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-4 cursor-pointer py-2 text-sm font-semibold rounded-t-lg transition"
          :class="activeTab === tab.key
            ? 'bg-gray-100 dark:bg-gray-800 border border-b-gray-900 dark:border-b-gray-800 border-gray-200 dark:border-gray-700 text-indigo-400 -mb-px'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'">
          {{ tab.label }}
        </button>
      </div>

      <!-- Favorites Tab -->
      <div v-if="activeTab === 'favorites'">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Saved Favorites</h2>
          <span class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200">
            {{ favoritePlaceIds.length }} saved
          </span>
        </div>
        <div class="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <FavoriteList :favoriteIds="Array.from(favoritePlaceIds)" />
        </div>
      </div>

      <!-- Bookings Tab -->
      <div v-else-if="activeTab === 'bookings'">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Bookings</h2>
        <div v-if="bookingsLoading" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        </div>
        <div v-else-if="bookings.length === 0" class="text-center p-8 bg-gray-900 dark:bg-gray-800 rounded-xl border border-dashed border-gray-700 text-gray-400">
          No bookings yet. Visit a place and book your ticket!
        </div>
        <div v-else class="space-y-4">
          <div v-for="booking in bookings" :key="booking.id"
            class="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <img
              v-if="getBookingImage(booking)"
              :src="getBookingImage(booking)"
              class="h-16 w-16 rounded-lg object-cover shrink-0"
              :alt="booking.places?.name"
            />
            <div v-else class="h-16 w-16 rounded-lg bg-indigo-100 flex items-center justify-center text-2xl shrink-0">🏛️</div>
            <div class="grow min-w-0">
              <p class="font-bold text-gray-900 dark:text-white truncate">{{ booking.places?.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">📅 {{ formatDate(booking.visit_date) }} · 👥 {{ booking.num_visitors }} visitors · ₹{{ booking.total_price }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-red-50 text-red-600 ring-1 ring-red-200'">
                {{ booking.status }}
              </span>
              <button v-if="booking.status === 'confirmed'" @click="cancelBooking(booking.id)"
                class="text-xs text-red-500 hover:text-red-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div v-else-if="activeTab === 'reviews'">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Reviews</h2>
        <div v-if="reviewsLoading" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        </div>
        <div v-else-if="userReviews.length === 0" class="text-center p-8 bg-gray-900 dark:bg-gray-800 rounded-xl border border-dashed border-gray-700 text-gray-400">
          You haven't written any reviews yet.
        </div>
        <div v-else class="space-y-4">
          <div v-for="review in userReviews" :key="review.id"
            class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <div class="flex items-start justify-between gap-3">
              <div>
                <router-link :to="`/place/${review.places?.slug}`" class="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  {{ review.places?.name }}
                </router-link>
                <p class="text-sm text-yellow-500 font-bold mt-0.5">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</p>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">{{ formatDate(review.created_at) }}</span>
            </div>
            <p class="mt-2 text-gray-700 dark:text-gray-300 text-sm">{{ review.text_content }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';
import { useBookingsStore } from '@/stores/bookings';
import { supabase } from '@/supabase';
import { useToast } from 'vue-toastification';
import FavoriteList from '@/components/profile/FavoriteList.vue';

export default {
  name: 'Profile',
  components: { FavoriteList },
  data() {
    return {
      newUsername: '',
      activeTab: 'favorites',
      tabs: [
        { key: 'favorites', label: '⭐ Favorites' },
        { key: 'bookings', label: '🎟️ Bookings' },
        { key: 'reviews', label: '📝 Reviews' }
      ],
      userReviews: [],
      reviewsLoading: false
    };
  },
  computed: {
    ...mapState(useAuthStore, ['user', 'profile', 'isLoading']),
    ...mapState(useFavoritesStore, ['favoritePlaceIds']),
    ...mapState(useBookingsStore, { bookings: 'bookings', bookingsLoading: 'isLoading' }),
    initials() {
      return this.profile?.username ? this.profile.username[0].toUpperCase() : 'U';
    },
    avatarUrl() {
      return this.profile?.avatar_url || null;
    }
  },
  watch: {
    profile: {
      immediate: true,
      handler(p) { if (p) this.newUsername = p.username; }
    },
    activeTab(tab) {
      if (tab === 'bookings' && this.bookings.length === 0) this.fetchUserBookings();
      if (tab === 'reviews' && this.userReviews.length === 0) this.fetchUserReviews();
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['signOut']),
    ...mapActions(useFavoritesStore, ['fetchUserFavorites']),
    ...mapActions(useBookingsStore, ['fetchUserBookings', 'cancelBooking']),
    async handleSignOut() {
      await this.signOut()
      this.$router.push({ name: 'Home' })
    },

    async updateUsername() {
      const toast = useToast();
      const authStore = useAuthStore();
      try {
        const { error } = await supabase.from('profiles').update({ username: this.newUsername }).eq('id', authStore.user.id);
        if (error) throw error;
        authStore.profile = { ...authStore.profile, username: this.newUsername };
        toast.success('Username updated!');
      } catch (err) {
        toast.error('Failed to update username: ' + err.message);
      }
    },

    async handleFileUpload(event) {
      const toast = useToast();
      const file = event.target.files[0];
      if (!file) return;
      const authStore = useAuthStore();
      const filePath = `${authStore.user.id}/avatar.${file.name.split('.').pop()}`;
      try {
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        const { error: updateError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', authStore.user.id);
        if (updateError) throw updateError;
        authStore.profile = { ...authStore.profile, avatar_url: data.publicUrl };
        toast.success('Avatar updated!');
      } catch (err) {
        toast.error('Avatar upload failed: ' + err.message);
      }
    },

    async fetchUserReviews() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;
      this.reviewsLoading = true;
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, text_content, created_at, places(name, slug)')
          .eq('user_id', authStore.user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        this.userReviews = data;
      } catch (err) {
        useToast().error('Failed to load reviews.');
      } finally {
        this.reviewsLoading = false;
      }
    },

    getBookingImage(booking) {
      const images = booking.places?.place_images;
      if (!images?.length) return null;
      return images.find(i => i.is_hero)?.url || images[0].url;
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  },
  mounted() {
    this.fetchUserFavorites();
    this.fetchUserBookings();
  }
};
</script>
