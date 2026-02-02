<template>
  <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Concept
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <td class="px-4 py-3 text-xs font-mono text-gray-600 dark:text-gray-400">
              {{ row.id }}
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getTypeBadgeClass(row.type)"
              >
                {{ row.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
              {{ row.name }}
            </td>
            <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
              {{ row.description }}
            </td>
            <td class="px-4 py-3">
              <span
                v-if="row.concept"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300"
              >
                {{ row.concept }}
              </span>
              <span v-else class="text-xs text-gray-400 dark:text-gray-500">—</span>
            </td>
            <td class="px-4 py-3">
              <button
                @click="$emit('view', row)"
                class="text-xs text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!data || data.length === 0"
      class="px-4 py-12 text-center"
    >
      <svg
        class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        No results to display
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: any[];
}>();

defineEmits<{
  view: [row: any];
}>();

function getTypeBadgeClass(type: string): string {
  const classes: Record<string, string> = {
    'Dataset': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'ScientificSurvey': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    'ScientificPaper': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'Process': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    'UserFeedback': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
  };
  return classes[type] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
}
</script>
