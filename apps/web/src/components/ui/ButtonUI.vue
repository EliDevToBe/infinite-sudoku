<template>
  <button :class="buttonClass" :disabled="disabled || isLoading">
    <slot></slot>
    <Transition
      enter-active-class="transition-all duration-150 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <SpinnerIcon v-if="isLoading" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from "vue";
import { useTheme } from "@/composables";
import SpinnerIcon from "./SpinnerIcon.vue";

const { theme } = useTheme();

type Props = {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "icon-xs" | "icon" | "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
});

const buttonClass = computed(() => {
  return [
    ui.size[props.size],
    ui.base,
    props.disabled ? ui.disabled : ui[theme.value][props.variant],
  ].join(" ");
});

const ui = {
  base: "gap-1 flex items-center justify-center cursor-pointer text-center transition-all duration-150 ease-in-out",
  disabled: "opacity-50 cursor-not-allowed bg-gray-400 text-gray-700",
  size: {
    "icon-xs": "w-4 h-4 text-xs rounded-full",
    icon: "w-6 h-6 text-xs rounded-md ",
    sm: "min-w-15 h-8 text-xs p-1 rounded-md ",
    md: "min-w-20 h-10 text-md p-2 rounded-md",
    lg: "min-w-24 h-12 text-lg p-2 rounded-md",
  },
  light: {
    primary: `
       bg-lTheme-light text-lTheme-font
       shadow-xs shadow-black
       md:hover:shadow-sm md:hover:shadow-lTheme-accent
        active:bg-lTheme-surfaceOther`,
    secondary: `
        bg-lTheme-surfaceOther text-lTheme-accent
        outline-[1px] outline-lTheme-light outline-lTheme-font
      shadow-xs shadow-black
      md:hover:shadow-sm md:hover:shadow-lTheme-accent
      active:bg-lTheme-light`,
    danger: `
      bg-lTheme-danger text-lTheme-surface
      shadow-xs shadow-black
      md:hover:shadow-sm md:hover:shadow-lTheme-accent
        active:bg-lTheme-dangerOther`,
    ghost: ``,
  },
  dark: {
    primary: `
      bg-dTheme-surfaceOther text-dTheme-font
      shadow-xs shadow-black shadow-opacity-50
      md:hover:shadow-sm md:hover:shadow-dTheme-accent
      active:bg-dTheme-surface active:text-dTheme-light`,
    secondary: `
      bg-dTheme-surfaceOther text-dTheme-font
       shadow-xs shadow-black
      md:hover:shadow-sm md:hover:shadow-dTheme-accent
      active:bg-dTheme-surface active:text-dTheme-light`,
    danger: `
      bg-dTheme-danger text-dTheme-font
      shadow-xs shadow-black
      md:hover:shadow-sm md:hover:shadow-dTheme-accent
      active:bg-dTheme-dangerOther active:text-dTheme-light`,
    ghost: `text-gray-500 outline-none outline-gray-600 md:hover:bg-gray-500 md:hover:bg-opacity-15 `,
  },
};
</script>

<style scoped lang="css"></style>
