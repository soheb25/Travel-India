// src/stores/auth.js
import { defineStore } from 'pinia';
import { supabase } from '@/supabase'; // Import the client

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Supabase user object
    profile: null, // Custom profile data (username, avatar, is_admin)
    isLoading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    // Safely check for admin status
    isAdmin: (state) => state.profile?.is_admin === true
  },
  actions: {
    // --- 1. Initial Session Check & Profile Fetch ---
    async fetchSession() {
      this.isLoading = true;
      this.error = null;
      try {
        // 1. Get the current user session
        const { data: { user } } = await supabase.auth.getUser();
        this.user = user;

        if (user) {
          // 2. Fetch the custom profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          this.profile = profile;
        }
      } catch (err) {
        this.error = err.message || 'Failed to fetch session.';
        this.user = null;
        this.profile = null;
      } finally {
        this.isLoading = false;
      }
    },

    async signIn({ email, password }) {
      this.isLoading = true;
      this.error = null;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Set user immediately so router guard works before onAuthStateChange fires
        this.user = data.user;
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles').select('*').eq('id', data.user.id).single();
          this.profile = profile;
        }
      } catch (err) {
        this.error = err.message || 'Sign in failed.';
      } finally {
        this.isLoading = false;
      }
    },

    async signOut() {
      this.isLoading = true;
      this.error = null;
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.user = null;
        this.profile = null;
      } catch (err) {
        this.error = err.message || 'Sign out failed.';
      } finally {
        this.isLoading = false;
      }
    },

    async signUp({ email, password, username }) {
      this.isLoading = true;
      this.error = null;
      try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            // Pass username as metadata. The trigger on the backend should pick this up,
            // or you handle the profile insertion client-side immediately after.
            options: {
                data: {
                    username: username 
                }
            }
        });
        
        if (error) throw error;
        
        // Success: Return true for the component to show confirmation message
        return true; 
        
      } catch (err) {
        this.error = err.message || 'Sign up failed.';
        return false; // Return false for the component to display error
      } finally {
        this.isLoading = false;
      }
    },
    async signInWithGoogle() {
      this.isLoading = true;
      this.error = null;
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        // Browser redirects to Google — isLoading stays true intentionally
      } catch (err) {
        this.error = err.message || 'Google sign-in failed.';
        this.isLoading = false;
      }
    },
  }
});