<template>
  <div id="app" class="flex flex-col min-h-screen relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 transition-colors duration-300">
    <!-- Decorative background blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div class="blob-1 absolute -top-24 -left-20 w-96 h-96 bg-indigo-200 dark:bg-indigo-900 opacity-30 rounded-full blur-3xl"></div>
      <div class="blob-2 absolute top-1/3 right-0 w-lg h-lg bg-pink-200 dark:bg-purple-900 opacity-25 rounded-full blur-3xl"></div>
      <div class="blob-3 absolute bottom-0 left-1/3 w-160 h-160 bg-purple-100 dark:bg-indigo-950 opacity-20 rounded-full blur-3xl"></div>
    </div>

    <AppHeader />

    <main class="grow relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in" appear>
            <keep-alive :include="['Home']">
              <component :is="Component" :key="route.name === 'PlaceDetail' ? route.fullPath : route.name" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </main>

    <footer class="bg-white/70 dark:bg-gray-900/70 backdrop-blur border-t border-gray-200 dark:border-gray-700 py-6 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
      <p>
        🌏 Built with ❤️ by <span class="font-semibold text-indigo-600 dark:text-indigo-400">Explore India</span> — Discover the beauty of every state.
      </p>
    </footer>
  </div>
</template>

<script>
import AppHeader from './layout/AppHeader.vue'
export default {
  components: { AppHeader }
}
</script>

<style scoped>
/* Transitions defined globally in main.css */
</style>