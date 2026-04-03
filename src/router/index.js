import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/map',
      name: 'Map',
      component: () => import('@/views/Map.vue'),
    },
    {
      path: '/place/:slug',
      name: 'PlaceDetail',
      component: () => import('@/views/PlaceDetail.vue'),
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('@/views/SignIn.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/SignUp.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/payment',
      name: 'Payment',
      component: () => import('@/views/Payment.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/booking-confirmation/:bookingId',
      name: 'BookingConfirmation',
      component: () => import('@/views/BookingConfirmation.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'places',
          name: 'admin-places',
          component: () => import('@/views/admin/PlacesCRUD.vue'),
        },
        {
          path: 'reviews',
          name: 'admin-reviews',
          component: () => import('@/views/admin/ReviewsModeration.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/CategoriesCRUD.vue'),
        },
        {
          path: '',
          redirect: { name: 'admin-places' },
        },
      ],
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Home.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  // main.js already awaits fetchSession() before app.use(router)
  // so auth state is always ready here — no async needed
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'SignIn', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'Home' })
  }
  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'Profile' })
  }

  next()
})

export default router