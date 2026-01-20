<template>
  <div class="h-screen flex flex-col">
    <!-- HEADER -->
    <AppHeader />

    <!-- MAIN AREA -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR (placeholder pour l’instant) -->
      <aside class="w-64 border-r bg-white">
        <div class="p-4 text-sm text-gray-500">Sidebar (filtres & modes)</div>
      </aside>

      <!-- CONTENT -->
      <main class="flex-1 overflow-auto bg-gray-50">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/navigation/AppHeader.vue";
</script>
