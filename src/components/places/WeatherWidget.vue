<template>
  <div class="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">

    <!-- Header -->
    <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-200 flex items-center gap-2">
      🌤️ Current Weather
    </h3>

    <!-- No API key -->
    <div v-if="!apiKey" class="rounded-lg bg-amber-50 dark:bg-gray-800 border border-amber-200 p-3 text-sm text-amber-700">
      Add <code class="font-mono bg-amber-100 dark:bg-gray-800 px-1 rounded">VITE_OPENWEATHER_KEY</code> to your .env to enable weather.
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="animate-pulse space-y-3">
      <div class="h-16 rounded-xl bg-gray-100 dark:bg-gray-600"></div>
      <div class="grid grid-cols-3 gap-2">
        <div v-for="n in 3" :key="n" class="h-20 rounded-xl bg-gray-100 dark:bg-gray-600"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Weather data -->
    <div v-else-if="current" class="space-y-4">

      <!-- Current conditions -->
      <div class="flex items-center justify-between rounded-xl p-4"
        :class="bgClass">
        <div>
          <div class="flex items-end gap-2">
            <span class="text-5xl font-extrabold" :class="tempTextClass">
              {{ current.temp }}°C
            </span>
            <span class="mb-1 text-sm font-medium" :class="tempTextClass + ' opacity-80'">
              Feels {{ current.feels }}°C
            </span>
          </div>
          <p class="mt-1 capitalize text-sm font-semibold" :class="tempTextClass">
            {{ current.description }}
          </p>
          <p class="text-xs mt-0.5" :class="tempTextClass + ' opacity-70'">
            💧 {{ current.humidity }}% humidity · 💨 {{ current.wind }} km/h wind
          </p>
        </div>
        <img
          :src="`https://openweathermap.org/img/wn/${current.icon}@2x.png`"
          :alt="current.description"
          class="h-20 w-20 drop-shadow"
        />
      </div>

      <!-- Visit advice banner -->
      <div class="rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-2"
        :class="advice.class">
        <span>{{ advice.icon }}</span>
        <span>{{ advice.text }}</span>
      </div>

      <!-- 3-day forecast -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">3-Day Forecast</p>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="day in forecast" :key="day.date"
            class="flex flex-col items-center rounded-xl bg-gray-50 dark:bg-gray-700 p-3 ring-1 ring-gray-100 dark:ring-gray-600">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ day.label }}</p>
            <img :src="`https://openweathermap.org/img/wn/${day.icon}.png`" :alt="day.desc" class="h-10 w-10" />
            <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ day.max }}°</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">{{ day.min }}°</p>
          </div>
        </div>
      </div>

      <p class="text-right text-xs text-gray-300">via OpenWeatherMap</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherWidget',
  props: {
    lat: { type: [Number, String], required: true },
    lng: { type: [Number, String], required: true },
    placeName: { type: String, default: '' }
  },
  data() {
    return {
      current: null,
      forecast: [],
      isLoading: false,
      error: null,
      apiKey: import.meta.env.VITE_OPENWEATHER_KEY || ''
    }
  },
  computed: {
    bgClass() {
      if (!this.current) return 'bg-blue-50'
      const t = this.current.temp
      if (t >= 35) return 'bg-orange-50 ring-1 ring-orange-100'
      if (t >= 25) return 'bg-yellow-50 ring-1 ring-yellow-100'
      if (t >= 15) return 'bg-blue-50 ring-1 ring-blue-100'
      return 'bg-indigo-50 ring-1 ring-indigo-100'
    },
    tempTextClass() {
      if (!this.current) return 'text-blue-700'
      const t = this.current.temp
      if (t >= 35) return 'text-orange-700'
      if (t >= 25) return 'text-yellow-700'
      if (t >= 15) return 'text-blue-700'
      return 'text-indigo-700'
    },
    advice() {
      if (!this.current) return {}
      const t = this.current.temp
      const desc = this.current.description.toLowerCase()
      if (desc.includes('rain') || desc.includes('storm') || desc.includes('drizzle'))
        return { icon: '🌧️', text: 'Carry an umbrella — rain expected today.', class: 'bg-blue-50 text-blue-700' }
      if (desc.includes('snow'))
        return { icon: '❄️', text: 'Snow conditions — dress warmly.', class: 'bg-indigo-50 text-indigo-700' }
      if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze'))
        return { icon: '🌫️', text: 'Low visibility — drive carefully.', class: 'bg-gray-100 text-gray-600' }
      if (t >= 38)
        return { icon: '🥵', text: 'Extreme heat — visit early morning or evening.', class: 'bg-red-50 text-red-700' }
      if (t >= 30)
        return { icon: '☀️', text: 'Hot day — carry water and sunscreen.', class: 'bg-orange-50 text-orange-700' }
      if (t >= 20)
        return { icon: '😊', text: 'Great weather for a visit today!', class: 'bg-emerald-50 text-emerald-700' }
      if (t >= 10)
        return { icon: '🧥', text: 'Cool weather — a light jacket is recommended.', class: 'bg-blue-50 text-blue-700' }
      return { icon: '🥶', text: 'Cold conditions — bundle up before visiting.', class: 'bg-indigo-50 text-indigo-700' }
    }
  },
  watch: {
    lat: { immediate: true, handler: 'fetchWeather' }
  },
  methods: {
    async fetchWeather() {
      if (!this.apiKey || !this.lat || !this.lng) return
      if (this.apiKey === 'your_openweathermap_api_key_here') return

      this.isLoading = true
      this.error = null
      this.current = null
      this.forecast = []

      try {
        const base = 'https://api.openweathermap.org/data/2.5'
        const params = `lat=${this.lat}&lon=${this.lng}&appid=${this.apiKey}&units=metric`

        const [curRes, foreRes] = await Promise.all([
          fetch(`${base}/weather?${params}`),
          fetch(`${base}/forecast?${params}&cnt=24`)
        ])

        if (!curRes.ok) throw new Error('Weather data unavailable for this location.')
        if (!foreRes.ok) throw new Error('Forecast data unavailable.')

        const curData = await curRes.json()
        const foreData = await foreRes.json()

        // Current weather
        this.current = {
          temp: Math.round(curData.main.temp),
          feels: Math.round(curData.main.feels_like),
          humidity: curData.main.humidity,
          wind: Math.round(curData.wind.speed * 3.6), // m/s to km/h
          description: curData.weather[0].description,
          icon: curData.weather[0].icon
        }

        // Build 3-day forecast from 3-hourly data
        // Group by day, pick midday entry
        const days = {}
        foreData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0]
          if (!days[date]) days[date] = []
          days[date].push(item)
        })

        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        this.forecast = Object.entries(days)
          .slice(1, 4) // skip today, take next 3 days
          .map(([date, items]) => {
            const midday = items.find(i => i.dt_txt.includes('12:00')) || items[0]
            const temps = items.map(i => i.main.temp)
            const d = new Date(date)
            return {
              date,
              label: dayLabels[d.getDay()],
              icon: midday.weather[0].icon.replace('n', 'd'), // force day icon
              desc: midday.weather[0].description,
              max: Math.round(Math.max(...temps)),
              min: Math.round(Math.min(...temps))
            }
          })

      } catch (err) {
        this.error = err.message || 'Could not load weather data.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
