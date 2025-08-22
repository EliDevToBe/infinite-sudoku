<template>
  <button :class="buttonClass">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from "vue";
import { useTheme } from "@/composables";

const { theme } = useTheme();

type Props = {
  variant?: "primary" | "secondary";
  size?: "icon" | "sm" | "md" | "lg";
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
});

const buttonClass = computed(() => {
  return [ui.size[props.size], ui[theme.value][props.variant], ui.base].join(
    " "
  );
});

const ui = {
  base: "rounded-md cursor-pointer text-center transition-all duration-150 ease-in-out",
  size: {
    icon: "w-6 h-6 text-xs justify-center items-center flex",
    sm: "w-15 h-8 text-xs p-1",
    md: "w-20 h-10 text-md p-2",
    lg: "w-24 h-12 text-lg p-2",
  },
  light: {
    primary: `
       bg-lTheme-light text-lTheme-font
       shadow-xs shadow-lTheme-font 
       hover:shadow-sm hover:shadow-lTheme-accent
        active:bg-lTheme-surfaceOther`,
    secondary: `
        bg-lTheme-surfaceOther text-lTheme-accent 
        outline-[1px] outline-lTheme-light outline-lTheme-font 
      hover:shadow-sm hover:shadow-lTheme-accent
      active:bg-lTheme-light`,
  },
  dark: {
    primary: `
      bg-dTheme-surfaceOther text-dTheme-font
      shadow-xs shadow-dTheme-surface
      hover:shadow-sm hover:shadow-dTheme-accent
      active:bg-dTheme-surface active:text-dTheme-light`,
    secondary: `
      bg-dTheme-surfaceOther text-dTheme-font 
      hover:shadow-sm hover:shadow-dTheme-accent
      active:bg-dTheme-surface active:text-dTheme-light`,
  },
};
</script>

<style scoped lang=""></style>
