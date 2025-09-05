import { createSharedComposable, useStorage } from "@vueuse/core";
import { computed } from "vue";

type Theme = "light" | "dark";
const theme = useStorage<Theme>("infinite-sudoku-theme", "dark");

export const useTheme = createSharedComposable(() => {
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  const isLightTheme = computed(() => theme.value === "light");

  return {
    theme,
    toggleTheme,
    isLightTheme,
  };
});
