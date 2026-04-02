<template>
  <div class="relative space-y-8">

    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-24 -z-10 overflow-hidden blur-3xl">
      <div class="mx-auto h-96 w-7xl bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 opacity-60" />
    </div>

    <!-- HERO -->
    <section class="glass dark:bg-gray-900/80 shadow-3d p-6 sm:p-8 rounded-2xl border border-white/60 dark:border-indigo-900/50">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 class="text-shine text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore India's Wonders
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Discover monuments, nature, and cultural sites across every state.</p>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center shrink-0">
          <div class="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm lift reveal reveal-delay-1">
            <p class="text-xs uppercase tracking-wide text-gray-400 dark:text-indigo-400">Places</p>
            <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ totalCount }}</p>
          </div>
          <div class="rounded-xl border border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm lift reveal reveal-delay-2">
            <p class="text-xs uppercase tracking-wide text-gray-400 dark:text-purple-400">States</p>
            <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ states?.length || 0 }}</p>
          </div>
          <div class="rounded-xl border border-pink-100 dark:border-pink-900 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm lift reveal reveal-delay-3">
            <p class="text-xs uppercase tracking-wide text-gray-400 dark:text-pink-400">Themes</p>
            <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ categories?.length || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Search bar -->
      <div class="relative mt-6">
        <input
          v-model="localSearch"
          type="search"
          placeholder="Search places, states, or categories..."
          class="w-full p-4 pl-12 pr-28 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl focus:ring-4 focus:ring-indigo-200/60 dark:focus:ring-indigo-700/60 focus:border-indigo-500 dark:focus:border-indigo-500 transition text-base sm:text-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
          @keyup.enter="applySearch"
        />
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button v-if="localSearch" @click="clearSearch"
            class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">Clear</button>
          <button @click="applySearch"
            class="btn-3d px-4 py-2 text-sm cursor-pointer font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Search</button>
        </div>
      </div>
    </section>

    <!-- Mobile filter toggle -->
    <div class="md:hidden flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Showing <span class="font-bold text-gray-800 dark:text-gray-200">{{ allPlaces.length }}</span> of
        <span class="font-bold text-gray-800 dark:text-gray-200">{{ totalCount }}</span> places
      </p>
      <button @click="showMobileFilters = !showMobileFilters"
        class="inline-flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-400 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 8h10M11 12h4"/>
        </svg>
        Filters
        <span v-if="activeFilterCount > 0"
          class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold">
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <!-- Mobile filter drawer -->
    <transition name="slide-down">
      <div v-if="showMobileFilters"
        class="md:hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-indigo-900/50 shadow-xl p-5 space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">Filters</h3>
          <button @click="showMobileFilters = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">State/UT</label>
            <select :value="filters.state" @change="updateFilter('state', $event.target.value || null)"
              class="w-full cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-2 text-sm focus:border-indigo-500">
              <option value="">All States</option>
              <option v-for="s in states" :key="s.id" :value="s.slug">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Theme</label>
            <select :value="filters.category" @change="updateFilter('category', $event.target.value || null)"
              class="w-full cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-2 text-sm focus:border-indigo-500">
              <option value="">All Themes</option>
              <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Quick Tags</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="tag in quickTags" :key="tag" @click="toggleTag(tag)"
              class="px-3 py-1.5 text-sm rounded-full border font-medium transition"
              :class="(filters.tags||[]).includes(tag)
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:bg-indigo-900/30'">
              {{ tag }}
            </button>
          </div>
        </div>
        <div v-if="activeFilterCount > 0" class="pt-2 border-t border-gray-100 dark:border-gray-700">
          <button @click="clearAllFilters"
            class="w-full rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/30 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition">
            Clear All Filters
          </button>
        </div>
      </div>
    </transition>

    <!-- Active filter chips -->
    <div v-if="activeFilterCount > 0" class="flex flex-wrap gap-2 items-center">
      <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Active:</span>
      <button v-if="filters.state" @click="updateFilter('state', null)"
        class="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition">
        📍 {{ states.find(s => s.slug === filters.state)?.name || filters.state }} <span>×</span>
      </button>
      <button v-if="filters.category" @click="updateFilter('category', null)"
        class="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/40 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition">
        🎨 {{ filters.category }} <span>×</span>
      </button>
      <button v-for="t in (filters.tags || [])" :key="t" @click="toggleTag(t)"
        class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/40 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition">
        🏷️ {{ t }} <span>×</span>
      </button>
      <button @click="clearAllFilters" class="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 underline transition ml-1">Clear all</button>
    </div>

    <!-- Main layout -->
    <div class="flex flex-col md:flex-row gap-8">

      <!-- SIDEBAR -->
      <aside class="hidden md:block w-64 lg:w-72 shrink-0 self-start sticky top-6">
        <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-indigo-900/40 shadow-3d overflow-hidden">
          <div class="bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-4">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 8h10M11 12h4"/>
              </svg>
              Filters
              <span v-if="activeFilterCount > 0"
                class="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/20 text-white text-xs font-bold">
                {{ activeFilterCount }}
              </span>
            </h3>
          </div>
          <div class="p-5 space-y-6">
            <div>
              <label class="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">State / UT</label>
              <div class="relative">
                <select :value="filters.state" @change="updateFilter('state', $event.target.value || null)"
                  class="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition">
                  <option value="">🗺️ All States</option>
                  <option v-for="s in states" :key="s.id" :value="s.slug">{{ s.name }}</option>
                </select>
                <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">Theme</label>
              <div class="relative">
                <select :value="filters.category" @change="updateFilter('category', $event.target.value || null)"
                  class="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition">
                  <option value="">🎨 All Themes</option>
                  <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
                </select>
                <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide mb-2">Quick Tags</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in quickTags" :key="tag" @click="toggleTag(tag)"
                  class="px-3 py-1.5 text-xs rounded-full border font-semibold transition"
                  :class="(filters.tags||[]).includes(tag)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50'">
                  {{ tag }}
                </button>
              </div>
            </div>
            <div v-if="activeFilterCount > 0" class="pt-2 border-t border-gray-100 dark:border-gray-700">
              <button @click="clearAllFilters"
                class="w-full rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                ✕ Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- RESULTS -->
      <div class="grow min-w-0">
        <div class="hidden md:flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            Showing <span class="text-indigo-600 dark:text-indigo-400">{{ allPlaces.length }}</span>
            of <span class="text-indigo-600 dark:text-indigo-400">{{ totalCount }}</span> places
          </h2>
        </div>

        <div v-if="allPlaces.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 perspective">
          <div v-for="place in allPlaces" :key="place.id" class="rounded-2xl overflow-hidden">
            <PlaceCard :place="place" :isAuthenticated="isAuthenticated" />
          </div>
        </div>

        <div v-else-if="!isLoading" class="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-200 dark:border-gray-700">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">No places found.</p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters.</p>
          <button @click="clearAllFilters"
            class="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
            Clear Filters
          </button>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <div v-for="n in 6" :key="n" class="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <div class="h-44 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="mt-2 h-3 w-full rounded bg-gray-100 dark:bg-gray-700/50"></div>
            <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
          </div>
        </div>

        <div class="text-center py-8">
          <button v-if="pagination.hasMore && !isLoading" @click="loadMorePlaces"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Load More Places
          </button>
          <p v-else-if="!pagination.hasMore && allPlaces.length > 0" class="text-sm text-gray-400 dark:text-gray-500">
            🎉 You've seen all {{ totalCount }} places!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { usePlacesStore } from '@/stores/places'
import { useAuthStore } from '@/stores/auth'
import PlaceCard from '@/components/places/PlaceCard.vue'

export default {
  name: 'Home',
  components: { PlaceCard },
  data() {
    return {
      localSearch: '',
      showMobileFilters: false,
      _searchTimer: null,
      _syncingFromStore: false,
      quickTags: ['UNESCO', 'Beach', 'Spiritual', 'Hill Station', 'Wildlife']
    }
  },
  computed: {
    ...mapState(usePlacesStore, ['allPlaces', 'totalCount', 'states', 'categories', 'filters', 'isLoading', 'pagination']),
    ...mapState(useAuthStore, ['isAuthenticated']),
    activeFilterCount() {
      let count = 0
      if (this.filters.state) count++
      if (this.filters.category) count++
      count += (this.filters.tags || []).length
      return count
    }
  },
  watch: {
    localSearch(newVal) {
      if (this._syncingFromStore) return
      clearTimeout(this._searchTimer)
      this._searchTimer = setTimeout(() => this.applySearch(), 350)
    }
  },
  methods: {
    ...mapActions(usePlacesStore, ['fetchInitialData', 'loadMorePlaces']),
    syncUrl() {
      const q = {}
      if (this.filters.search) q.search = this.filters.search
      if (this.filters.state) q.state = this.filters.state
      if (this.filters.category) q.category = this.filters.category
      if (this.filters.tags?.length) q.tags = this.filters.tags.join(',')
      this.$router.replace({ query: q }).catch(() => {})
    },
    checkScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300
      if (nearBottom && !this.isLoading && this.pagination.hasMore) this.loadMorePlaces()
    },
    updateFilter(key, value) {
      if (!Array.isArray(this.filters.tags)) this.filters.tags = []
      this.filters[key] = value
      this.syncUrl()
      this.fetchInitialData(true)
    },
    toggleTag(tag) {
      if (!Array.isArray(this.filters.tags)) this.filters.tags = []
      const i = this.filters.tags.indexOf(tag)
      if (i > -1) this.filters.tags.splice(i, 1)
      else this.filters.tags.push(tag)
      this.syncUrl()
      this.fetchInitialData(true)
    },
    applySearch() {
      this.filters.search = (this.localSearch || '').trim()
      this.syncUrl()
      this.fetchInitialData(true)
    },
    clearSearch() {
      this.localSearch = ''
      this.filters.search = ''
      this.syncUrl()
      this.fetchInitialData(true)
    },
    clearAllFilters() {
      this.localSearch = ''
      this.filters.search = ''
      this.filters.state = null
      this.filters.category = null
      this.filters.tags = []
      this.showMobileFilters = false
      this.syncUrl()
      this.fetchInitialData(true)
    }
  },
  async mounted() {
    this._syncingFromStore = true
    this.localSearch = this.filters.search || ''
    await this.$nextTick()
    this._syncingFromStore = false

    const q = this.$route.query
    if (Object.keys(q).length > 0) {
      this.filters.search = q.search || ''
      this.filters.state = q.state || null
      this.filters.category = q.category || null
      this.filters.tags = q.tags ? q.tags.split(',') : []
      this._syncingFromStore = true
      this.localSearch = this.filters.search
      await this.$nextTick()
      this._syncingFromStore = false
    }

    if (this.allPlaces.length === 0) await this.fetchInitialData(true)
    window.addEventListener('scroll', this.checkScroll, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.checkScroll)
    clearTimeout(this._searchTimer)
  }
}
</script>

<style scoped>
@keyframes shimmer { 100% { transform: translateX(100%); } }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
