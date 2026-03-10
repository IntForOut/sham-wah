<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      title="Change language"
    >
      <IconLanguage class="w-6 h-6" />
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
      >
        <div class="py-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="w-full px-4 py-2 text-left text-sm transition-colors duration-150 flex items-center justify-between"
            :class="
              currentLanguage === lang.code
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            "
          >
            <span class="flex items-center gap-2">
              <span class="text-lg">{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
            </span>
            <svg
              v-if="currentLanguage === lang.code"
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import IconLanguage from "~/components/icons/IconLanguage.vue";

const isOpen = ref(false);
const currentLanguage = ref("fr");
const dropdownRef = ref<HTMLElement | null>(null);

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

onMounted(() => {
  // Load saved language preference
  // const savedLang = localStorage.getItem("language");
  const savedLang = "en";
  if (savedLang) {
    currentLanguage.value = savedLang;
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function selectLanguage(code: string) {
  currentLanguage.value = code;
  localStorage.setItem("language", code);
  isOpen.value = false;

  // Here you would typically integrate with your i18n solution
  // For example: this.$i18n.locale = code;
  console.log(`Language changed to: ${code}`);
}
</script>
