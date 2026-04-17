<template>
  <div class="relative group z-10 hover:z-[70]">
    <div
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-300 cursor-default select-none"
      :class="badgeClass"
    >
      <span class="relative flex h-2 w-2 shrink-0">
        <span
          v-if="status !== 'error'"
          class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          :class="pingClass"
        />
        <span
          class="relative inline-flex rounded-full h-2 w-2"
          :class="dotClass"
        />
      </span>

      <span>{{ label }}</span>

      <button
        class="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95"
        title="Refresh status"
        :disabled="status === 'checking'"
        @click.stop="checkStatus"
      >
        <svg
          class="w-3 h-3 transition-transform duration-500"
          :class="{ 'animate-spin': status === 'checking' }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>

    <!-- Tooltip -->
    <div
      class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[80] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
    >
      <div
        class="px-2.5 py-1.5 rounded-lg text-xs shadow-lg bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 border border-gray-700 dark:border-gray-600"
      >
        <div class="font-semibold mb-0.5">Neo4j Database</div>
        <div class="text-gray-300 dark:text-gray-400">{{ tooltipText }}</div>
        <div v-if="lastChecked" class="text-gray-500 dark:text-gray-500 mt-0.5">
          {{ lastCheckedText }}
        </div>
        <!-- Flèche -->
        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-gray-900 dark:border-b-gray-700"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const config = useRuntimeConfig();

const HEALTH_URL = `${config.public.NEO4J_API_URL}/db/ready`;
const POLL_INTERVAL_MS = 30_000; // re-ping toutes les 30 s

type Status = "checking" | "ok" | "error";

const status = ref<Status>("checking");
const lastChecked = ref<Date | null>(null);
const errorMessage = ref<string>("");

let intervalId: ReturnType<typeof setInterval> | null = null;

const badgeClass = computed(() => ({
  // connecté
  "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400":
    status.value === "ok",
  // erreur
  "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400":
    status.value === "error",
  "bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-700 text-gold-700 dark:text-gold-400":
    status.value === "checking",
}));

const dotClass = computed(() => ({
  "bg-emerald-500": status.value === "ok",
  "bg-red-500": status.value === "error",
  "bg-gold-500": status.value === "checking",
}));

const pingClass = computed(() => ({
  "bg-emerald-400": status.value === "ok",
  "bg-gold-400": status.value === "checking",
}));

const label = computed(() => {
  if (status.value === "checking") return "Connecting…";
  if (status.value === "ok") return "Neo4j";
  return "Neo4j offline";
});

const tooltipText = computed(() => {
  if (status.value === "checking") return "Checking database connection…";
  if (status.value === "ok") return "Database is reachable ✓";
  return errorMessage.value || "Unable to reach the database";
});

const lastCheckedText = computed(() => {
  if (!lastChecked.value) return "";
  return `Last check: ${lastChecked.value.toLocaleTimeString()}`;
});

async function checkStatus() {
  status.value = "checking";
  try {
    const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      status.value = "ok";
      errorMessage.value = "";
    } else {
      const data = await res.json().catch(() => ({}));
      status.value = "error";
      errorMessage.value = data?.detail ?? `HTTP ${res.status}`;
    }
  } catch (err: unknown) {
    status.value = "error";
    errorMessage.value = err instanceof Error ? err.message : "Network error";
  } finally {
    lastChecked.value = new Date();
  }
}

onMounted(() => {
  checkStatus();
  intervalId = setInterval(checkStatus, POLL_INTERVAL_MS);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
