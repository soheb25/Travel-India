// src/stores/places.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const usePlacesStore = defineStore('places', {
  state: () => ({
    allPlaces: [],
    totalCount: 0,          // real total from Supabase — used for the counter in Home
    placeDetails: {},
    categories: [],
    states: [],
    filters: {
      search: '',
      state: null,
      category: null,
      tags: [],
    },
    pagination: {
      limit: 15,
      offset: 0,
      hasMore: true,
    },
    isLoading: false,         // only for Home list fetches
    isDetailLoading: false,   // only for PlaceDetail — never touches Home
    error: null,
    _lookupsLoaded: false,
  }),

  actions: {
    async _ensureLookups() {
      if (this._lookupsLoaded) return
      const { data: states, error: statesError } = await supabase
        .from('states')
        .select('id, name, slug')
        .order('name', { ascending: true })
      if (statesError) throw statesError
      this.states = states

      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true })
      if (catError) throw catError
      this.categories = categories

      this._lookupsLoaded = true
    },

    _buildPlacesQuery({ limit, offset } = {}) {
      const l = typeof limit === 'number' ? limit : this.pagination.limit
      const o = typeof offset === 'number' ? offset : this.pagination.offset

      let query = supabase
        .from('places')
        .select(
          `id, name, slug, description, latitude, longitude, popularity_score,
          states(name, slug),
          categories(name),
          place_images(url, is_hero)`,
          { count: 'exact' }
        )
        .order('popularity_score', { ascending: false })
        .range(o, o + l - 1)

      if (this.filters.search?.trim()) {
        query = query.ilike('name', `%${this.filters.search.trim()}%`)
      }

      // Filter by state_id directly on the places table using the id from loaded lookups
      if (this.filters.state) {
        const stateObj = this.states.find(s => s.slug === this.filters.state)
        if (stateObj) query = query.eq('state_id', stateObj.id)
      }

      // Filter by category_id directly on the places table using the id from loaded lookups
      if (this.filters.category) {
        const catObj = this.categories.find(c => c.name === this.filters.category)
        if (catObj) query = query.eq('category_id', catObj.id)
      }

      return query
    },

    async fetchInitialData(reset = false) {
      if (this.isLoading) return
      this.isLoading = true
      this.error = null

      try {
        await this._ensureLookups()

        if (reset) {
          this.pagination.offset = 0
          this.pagination.hasMore = true
          this.allPlaces = []
        }

        const limit = this.pagination.limit
        const offset = this.pagination.offset

        const { data: rows, count, error } = await this._buildPlacesQuery({ limit, offset })
        if (error) throw error

        // Store real total so the counter in Home is always accurate
        if (count !== null) this.totalCount = count

        if (offset === 0) this.allPlaces = rows
        else this.allPlaces = [...this.allPlaces, ...rows]

        this.pagination.offset = offset + rows.length
        // hasMore: if we got a full page there may be more
        this.pagination.hasMore = rows.length === limit
      } catch (err) {
        this.error = err?.message || 'Failed to fetch places.'
      } finally {
        this.isLoading = false
      }
    },

    async loadMorePlaces() {
      if (this.isLoading || !this.pagination.hasMore) return
      await this.fetchInitialData(false)
    },

    async fetchAllForMap() {
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('places')
          .select(`id, name, slug, description, latitude, longitude, is_verified,
            states(name), categories(name),
            place_images(url, is_hero)`)
          .order('popularity_score', { ascending: false })
        if (error) throw error
        return data
      } catch (err) {
        this.error = err?.message || 'Failed to fetch map data.'
        return []
      } finally {
        this.isLoading = false
      }
    },

    async fetchPlaceBySlug(slug) {
      // Uses isDetailLoading — completely separate from isLoading used by Home
      this.isDetailLoading = true
      this.error = null
      try {
        const { data: place, error } = await supabase
          .from('places')
          .select(`
            *,
            states(name, slug),
            categories(name),
            place_images(url, is_hero, sort_order),
            reviews(
              id, rating, text_content, created_at, user_id,
              profiles(username, avatar_url)
            )
          `)
          .eq('slug', slug)
          .single()

        if (error) throw error

        this.placeDetails[slug] = place
        return place
      } catch (err) {
        this.error = err?.message || 'Failed to fetch place details.'
        return null
      } finally {
        this.isDetailLoading = false
      }
    },
  },
})
