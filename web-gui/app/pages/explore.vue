<template>
  <div class="h-full p-6">
    <div class="h-full flex flex-col">
      <div class="flex-1 min-h-0">
        <GraphCanvas />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GraphCanvas from "@/components/canvas/GraphCanvas.vue";
</script>
