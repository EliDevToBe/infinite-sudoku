import { createSharedComposable, useStorage } from "@vueuse/core";
import { computed } from "vue";

type Theme = "light" | "dark";

export const useTheme = createSharedComposable(() => {
  const theme = useStorage<Theme>("theme", "light");

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
