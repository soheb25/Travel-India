<template>
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="n in 2" :key="n" class="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
    
    <div v-else-if="favoritePlaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlaceCard 
            v-for="place in favoritePlaces" 
            :key="place.id" 
            :place="place" 
            :isAuthenticated="true" 
        />
    </div>

    <div v-else class="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-gray-500">
        You haven't saved any places yet. Go explore!
    </div>
</template>

<script>
import { supabase } from '@/supabase';
import PlaceCard from '@/components/places/PlaceCard.vue';

export default {
    name: 'FavoriteList',
    components: { PlaceCard },
    props: {
        favoriteIds: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            favoritePlaces: [],
            isLoading: false,
            error: null
        };
    },
    watch: {
        // Watch for changes in the IDs list and refetch the details
        favoriteIds: {
            immediate: true,
            handler: 'fetchFavoriteDetails'
        }
    },
    methods: {
        async fetchFavoriteDetails(ids) {
            if (ids.length === 0) {
                this.favoritePlaces = [];
                return;
            }

            this.isLoading = true;
            this.error = null;

            try {
                // Fetch the place details for the IDs in the list
                const { data, error } = await supabase
                    .from('places')
                    .select(`
                        id, name, slug, description,
                        states (name), categories (name),
                        place_images (url, is_hero)
                    `)
                    .in('id', ids);

                if (error) throw error;
                this.favoritePlaces = data;

            } catch (err) {
                this.error = 'Failed to load favorite details.';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>