<template>
  <header class="sticky top-0 z-50 glass-dark shadow-[0_4px_30px_rgba(0,0,0,0.25)] border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">

        <!-- Brand -->
        <router-link to="/"
          class="group flex items-center gap-2 text-white font-extrabold text-lg sm:text-xl md:text-2xl tracking-wide select-none">
          <div class="flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/20 group-hover:bg-white/20 transition">
            🇮🇳
          </div>
          <span class="drop-shadow-sm group-hover:text-white/90 transition">
            Explore <span class="text-yellow-300">India</span>
          </span>
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">Explore</router-link>
          <router-link to="/map" class="nav-link" :class="{ active: $route.path.startsWith('/map') }">Map View</router-link>
          <router-link v-if="isAuthenticated" to="/profile" class="nav-link" :class="{ active: $route.path.startsWith('/profile') }">Profile</router-link>
          <router-link v-if="isAdmin" to="/admin" class="nav-link text-rose-300 font-semibold" :class="{ active: $route.path.startsWith('/admin') }">Admin</router-link>

          <!-- Dark mode toggle -->
          <button @click="toggleDark"
            class="ml-1 flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/20 transition"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <span :class="{ 'dark-toggle-spin': spinning }" class="text-base leading-none">
              {{ isDark ? '☀️' : '🌙' }}
            </span>
          </button>

          <router-link v-if="!isAuthenticated" to="/signup"
            class="ml-2 flex items-center gap-2 rounded-lg bg-white text-indigo-700 px-4 py-2 text-sm font-semibold shadow-md hover:bg-indigo-50 transition">
            Sign Up
          </router-link>
          <button v-else @click="handleSignOut"
            class="ml-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-indigo-100 hover:text-white hover:bg-white/10 transition">
            Sign Out
          </button>
        </nav>

        <!-- Mobile: dark toggle + hamburger -->
        <div class="md:hidden flex items-center gap-2">
          <button @click="toggleDark"
            class="flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/20 transition">
            <span :class="{ 'dark-toggle-spin': spinning }">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>

          <details ref="mobileMenu" @toggle="onMenuToggle" class="relative">
            <summary class="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/20 cursor-pointer transition">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </summary>

            <div class="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 animate-fade-in-up">
              <div class="p-2 divide-y divide-gray-100/50 dark:divide-gray-700">
                <div class="pb-2 space-y-1">
                  <router-link to="/" class="mobile-link" :class="{ 'active-mobile': $route.path === '/' }" @click="closeMenu">Explore</router-link>
                  <router-link to="/map" class="mobile-link" :class="{ 'active-mobile': $route.path.startsWith('/map') }" @click="closeMenu">Map View</router-link>
                  <router-link v-if="isAuthenticated" to="/profile" class="mobile-link" :class="{ 'active-mobile': $route.path.startsWith('/profile') }" @click="closeMenu">Profile</router-link>
                  <router-link v-if="isAdmin" to="/admin" class="mobile-link text-rose-600 font-semibold" @click="closeMenu">Admin</router-link>
                </div>
                <div class="pt-2">
                  <router-link v-if="!isAuthenticated" to="/signup"
                    class="block w-full text-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    @click="closeMenu">Sign Up</router-link>
                  <button v-else class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    @click="() => { handleSignOut(); closeMenu(); }">Sign Out</button>
                </div>
              </div>
            </div>
          </details>
        </div>

      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useDarkModeStore } from '@/stores/darkMode'

export default {
  name: 'AppHeader',
  data() {
    return { spinning: false }
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'isAdmin']),
    ...mapState(useDarkModeStore, ['isDark'])
  },
  methods: {
    ...mapActions(useAuthStore, ['signOut']),
    ...mapActions(useDarkModeStore, { toggleDarkMode: 'toggle' }),
    toggleDark() {
      this.spinning = true
      this.toggleDarkMode()
      setTimeout(() => { this.spinning = false }, 400)
    },
    async handleSignOut() {
      await this.signOut()
      this.$router.push({ name: 'Home' })
    },
    closeMenu() {
      if (this.$refs.mobileMenu) this.$refs.mobileMenu.open = false
    },
    onMenuToggle() {
      const menu = this.$refs.mobileMenu
      if (menu?.open) {
        const close = (e) => {
          if (!menu.contains(e.target)) { menu.open = false; window.removeEventListener('click', close) }
        }
        window.addEventListener('click', close)
      }
    }
  }
}
</script>

<style scoped>
@reference "@/assets/main.css";
.nav-link { @apply px-3 py-2 rounded-lg text-sm font-medium text-indigo-100 hover:text-white hover:bg-white/10 transition; }
.nav-link.active { @apply bg-white/20 text-white ring-1 ring-white/20; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.25s ease-out; }
.mobile-link { @apply block rounded-lg px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition; }
.mobile-link.active-mobile { @apply bg-gray-100 dark:bg-gray-700 font-semibold; }
</style>
