import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { supabase } from './supabase'
import { useAuthStore } from './stores/auth'
import { useFavoritesStore } from './stores/favorites'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Toast, { timeout: 3000, position: 'top-right' })

const authStore = useAuthStore()
const favStore = useFavoritesStore()

await authStore.fetchSession()
if (authStore.isAuthenticated) {
  await favStore.fetchUserFavorites()
}

app.use(router)

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    if (authStore.user?.id !== session.user.id) {
      await authStore.fetchSession()
      await favStore.fetchUserFavorites()
    }
  } else if (event === 'SIGNED_OUT') {
    authStore.user = null
    authStore.profile = null
    favStore.favoritePlaceIds = []
  }
})

// Apply saved dark mode preference before mount to avoid flash
const saved = localStorage.getItem('darkMode')
if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}

app.mount('#app')
