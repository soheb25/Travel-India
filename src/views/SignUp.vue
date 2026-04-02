<template>
  <div class="max-w-md mx-auto p-8 mt-10 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-indigo-900/50">
    <h1 class="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">Create Your Account</h1>
    <div v-if="signupSuccess" class="p-4 mb-4 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-800">
        Success! Check your email to confirm your account before logging in.
    </div>
    <form v-else @submit.prevent="handleSignUp" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input id="username" v-model="username" type="text" required
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
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
      <div v-if="signupError" class="p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg">{{ signupError }}</div>
      <button type="submit" :disabled="isLoading"
        class="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition">
        {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
      </button>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
        Already have an account?
        <router-link :to="{ name: 'SignIn' }" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Sign In</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      isLoading: false,
      signupError: null,
      signupSuccess: false
    };
  },
  methods: {
    ...mapActions(useAuthStore, ['signUp']),
    
    async handleSignUp() {
      const authStore = useAuthStore();
      this.isLoading = true;
      this.signupError = null;
      this.signupSuccess = false;

      // Note: The username handling is slightly simplified here. 
      // Ensure your Supabase setup correctly processes the username.
      const success = await this.signUp({ 
        email: this.email, 
        password: this.password, 
        username: this.username 
      });

      if (success) {
        this.signupSuccess = true;
        // Optionally redirect after a delay, or wait for email confirmation
      } else {
        // Error message is handled and stored in the auth store's error state
        this.signupError = authStore.error;
      }
      this.isLoading = false;
    }
  }
};
</script>