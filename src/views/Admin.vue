<template>
  <div class="mx-auto max-w-7xl py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
    <!-- === HERO / TOPBAR === -->
    <header
      class="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 text-white shadow-xl"
    >
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
      <div class="absolute -left-28 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div class="px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m4-3.016A12 12 0 0112 3a12 12 0 01-8 3.984A12 12 0 004 12c.3 2.85 1.2 5.5 2.58 7.7 1.38 2.2 3.18 3.9 4.96 5.16a1 1 0 001.12 0c1.78-1.26 3.58-2.96 4.96-5.16C18.8 17.5 19.7 14.85 20 12a12 12 0 00-1-6.016z"/>
                </svg>
              </span>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            </div>
            <p class="mt-1 text-white/85 text-sm sm:text-base">Content curation • System moderation • Data hygiene</p>
          </div>

          <!-- Quick actions -->
          <div class="flex flex-wrap items-center gap-2">
            <router-link
              :to="{ name: 'admin-places' }"
              class="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-xs sm:text-sm font-semibold ring-1 ring-white/20 hover:bg-white/20"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              New Place
            </router-link>
            <router-link
              :to="{ name: 'admin-categories' }"
              class="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-rose-700 shadow hover:bg-rose-50"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
              Manage Lookups
            </router-link>
          </div>
        </div>

        <!-- Stat chips -->
        <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/20">
            <p class="text-[10px] sm:text-xs uppercase tracking-wide text-white/80">Places</p>
            <p class="mt-1 text-lg sm:text-xl font-bold">—</p>
          </div>
          <div class="rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/20">
            <p class="text-[10px] sm:text-xs uppercase tracking-wide text-white/80">Categories</p>
            <p class="mt-1 text-lg sm:text-xl font-bold">—</p>
          </div>
          <div class="rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/20">
            <p class="text-[10px] sm:text-xs uppercase tracking-wide text-white/80">Pending Reviews</p>
            <p class="mt-1 text-lg sm:text-xl font-bold">—</p>
          </div>
          <div class="rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/20">
            <p class="text-[10px] sm:text-xs uppercase tracking-wide text-white/80">Flags</p>
            <p class="mt-1 text-lg sm:text-xl font-bold">—</p>
          </div>
        </div>
      </div>
    </header>

    <!-- === LAYOUT === -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <!-- Mobile sidebar as details (drawer) -->
      <details class="lg:hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <summary
          class="list-none flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
          role="button" aria-label="Toggle admin menu"
        >
          <span class="font-semibold text-gray-900">Admin Menu</span>
          <svg class="h-4 w-4 text-gray-500 transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"/>
          </svg>
        </summary>

        <nav class="border-t border-gray-100 p-2">
          <router-link
            :to="{ name: 'admin-places' }"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 ring-1 ring-transparent hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 transition"
            active-class="bg-rose-100 text-rose-700 font-semibold ring-rose-200"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6m-4 4h8m-8 4h8M5 10v10a1 1 0 001 1h3"/>
            </svg>
            Manage Places (CRUD)
          </router-link>

          <router-link
            :to="{ name: 'admin-categories' }"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 ring-1 ring-transparent hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 transition"
            active-class="bg-rose-100 text-rose-700 font-semibold ring-rose-200"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            Manage Lookups (States/Categories)
          </router-link>

          <router-link
            :to="{ name: 'admin-reviews' }"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 ring-1 ring-transparent hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 transition"
            active-class="bg-rose-100 text-rose-700 font-semibold ring-rose-200"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h8M5 20l2-4h10l2 4M12 4v2"/>
            </svg>
            Moderate Reviews & Photos
          </router-link>
        </nav>
      </details>

      <!-- Desktop sidebar -->
      <aside
        class="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3"
      >
        <div class="sticky top-6 space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
          <h3 class="px-2 text-sm font-semibold text-gray-500">Navigation</h3>
          <nav class="space-y-2">
            <router-link
              :to="{ name: 'admin-places' }"
              class="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 ring-1 ring-transparent hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 transition"
              active-class="bg-rose-100 text-rose-700 font-semibold ring-rose-200"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6m-4 4h8m-8 4h8M5 10v10a1 1 0 001 1h3"/>
              </svg>
              Manage Places (CRUD)
            </router-link>

            <router-link
              :to="{ name: 'admin-categories' }"
              class="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 ring-1 ring-transparent hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 transition"
              active-class="bg-rose-100 text-rose-700 font-semibold ring-rose-200"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
              Manage Lookups (States/Categories)
            </router-link>

            <router-link
              :to="{ name: 'admin-reviews' }"
              class="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 ring-1 ring-transparent hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 transition"
              active-class="bg-rose-100 text-rose-700 font-semibold ring-rose-200"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h8M5 20l2-4h10l2 4M12 4v2"/>
              </svg>
              Moderate Reviews & Photos
            </router-link>
          </nav>

          <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
            <p class="text-sm font-semibold">Tip</p>
            <p class="text-xs">Use filters inside each section to speed up curation.</p>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main
        class="lg:col-span-8 xl:col-span-9 2xl:col-span-9 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-xl min-h-[60vh]"
      >
        <!-- Section header -->
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">Work Area</h2>
          <div class="flex w-full sm:w-auto items-center gap-2">
            <div class="relative w-full sm:w-64">
              <input
                type="search"
                placeholder="Quick search…"
                class="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500"
              />
              <svg class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.2-5.2M16 10a6 6 0 11-12 0 6 6 0 0112 0z"/>
              </svg>
            </div>
            <span class="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600">
              ⌘K <span class="text-gray-400">Command palette</span>
            </span>
          </div>
        </div>

        <div class="rounded-xl border border-dashed border-gray-200 p-2 sm:p-3">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>



<script>
// Since the route guard is already in router/index.js, 
// this component just handles the layout.

export default {
  name: 'Admin',
  // You might fetch admin-specific stats here later (e.g., pending reviews)
}
</script>