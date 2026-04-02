<template>
  <div class="max-w-md mx-auto p-8 mt-10 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-indigo-900/50">
    <h1 class="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">Sign In</h1>

    <form @submit.prevent="handleSignIn" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="email" v-model="email" type="email" required
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id="password" v-model="password" type="password" required
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div v-if="signInError" class="p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg">{{ signInError }}</div>

      <button 
        type="submit" 
        :disabled="isLoading || googleLoading"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition"
      >
        {{ isLoading ? 'Signing In...' : 'Sign In with Email' }}
      </button>
    </form>
    
    <div class="my-6 flex items-center">
      <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      <span class="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
      <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
    </div>
    <button @click="handleGoogleSignIn" :disabled="isLoading || googleLoading"
      class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition">
      <svg class="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M43.611 20.083H42V20H24v8h11.303c-1.637 4.092-5.748 6.89-10.748 6.89-6.42 0-11.62-5.199-11.62-11.62s5.199-11.62 11.62-11.62c3.21 0 6.166 1.306 8.286 3.23l5.86-5.86C36.216 4.869 30.7 2 24 2 13.595 2 5 10.595 5 21s8.595 19 19 19c9.434 0 17.595-6.666 18.39-16.166z" fill="#FFC107"/><path d="M5 21c0 3.313 1.096 6.43 3.016 9.07l5.86-5.86C13.298 23.362 13 22.198 13 21s.298-2.362.876-3.21l-5.86-5.86C6.096 14.57 5 17.687 5 21z" fill="#FF3D00"/><path d="M24 40c6.916 0 12.87-4.116 15.656-9.923l-5.86-5.86C32.193 30.144 28.32 32 24 32c-5.12 0-9.52-2.924-11.674-7.234l-5.86 5.86C9.284 36.884 16.084 40 24 40z" fill="#4CAF50"/><path d="M43.611 20.083H42V20H24V12h8.046c.168.618.254 1.258.254 1.916 0 1.942-.497 3.79-1.39 5.385l5.86 5.86C42.016 27.437 43 24.32 43 21c0-1.742-.303-3.41-.89-4.966z" fill="#1565C0"/></svg>
      Sign In with Google
    </button>
    
    <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
      New user?
      <router-link :to="{ name: 'SignUp' }" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
        Create an account
      </router-link>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      googleLoading: false,
      signInError: null
    };
  },
  methods: {
    ...mapActions(useAuthStore, ['signIn', 'signInWithGoogle']),
    
    async handleSignIn() {
      this.isLoading = true;
      this.signInError = null;
      await this.signIn({ email: this.email, password: this.password });
      const authStore = useAuthStore();
      if (authStore.error) {
        this.signInError = authStore.error;
      } else {
        const redirect = this.$route.query.redirect || '/profile';
        this.$router.push(redirect);
      }
      this.isLoading = false;
    },
    
    async handleGoogleSignIn() {
      this.googleLoading = true;
      this.signInError = null;
      await this.signInWithGoogle();
      const authStore = useAuthStore();
      if (authStore.error) {
        this.signInError = authStore.error;
        this.googleLoading = false;
      }
      // If no error, browser is already redirecting to Google — don't reset loading
    }
  }
};
</script>