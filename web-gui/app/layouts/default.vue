<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
    <!-- HEADER -->
    <AppHeader />

    <!-- MAIN -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR -->
      <AppSidebar />

      <!-- CONTENT -->
      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/navigation/AppHeader.vue";
import AppSidebar from "~/components/sidebar/AppSidebar.vue";
</script>
