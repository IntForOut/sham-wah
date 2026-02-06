<template>
  <div class="space-y-2">
    <label
      class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
    >
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      Relationship
    </label>

    <!-- Display Badge for Fixed Relationship -->
    <div
      class="px-4 py-3 rounded-lg border transition-all"
      :class="getBadgeStyles(relationship)"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Relationship Info -->
          <div>
            <p
              class="text-sm font-medium capitalize"
              :class="getTextStyles(relationship)"
            >
              {{ getRelationshipLabel(relationship) }}
            </p>
            <!-- <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ getRelationshipDescription(relationship) }}
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  relationship: "represents" | "affords" | "describes" | "observes" | string;
}>();

function getRelationshipLabel(rel: string): string {
  const labels: Record<string, string> = {
    represents: "Represents",
    affords: "Affords",
    describes: "Describes",
    observes: "Observes",
  };
  return labels[rel] || rel;
}

function getRelationshipDescription(rel: string): string {
  const descriptions: Record<string, string> = {
    represents:
      "Connect digital assets that are useful to derive meaningful representations of interests expressed with non digital concepts. It is a generic property that is inferred from the following : either a concept is present in the topicCategories, keywords, themes, application schema of a given asset.",
    affords: "Land entity affords an activity or capability",
    describes: "Asset describes or documents a concept",
    observes: "Asset observes or monitors a phenomenon",
  };
  return descriptions[rel] || "Relationship between asset and concept";
}

function getBadgeStyles(rel: string): string {
  const styles: Record<string, string> = {
    represents:
      "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
    affords:
      "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20",
    describes:
      "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
    observes:
      "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20",
  };
  return (
    styles[rel] ||
    "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
  );
}

function getTextStyles(rel: string): string {
  const styles: Record<string, string> = {
    represents: "text-blue-700 dark:text-blue-300",
    affords: "text-purple-700 dark:text-purple-300",
    describes: "text-green-700 dark:text-green-300",
    observes: "text-orange-700 dark:text-orange-300",
  };
  return styles[rel] || "text-gray-700 dark:text-gray-300";
}
</script>
