<template>
  <button :class="buttonClass">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from "vue";
import { useTheme } from "@/composables";

const { isLightTheme, theme } = useTheme();

type Props = {
  type?: "primary";
  size?: "icon" | "sm" | "md" | "lg";
};

const props = withDefaults(defineProps<Props>(), {
  type: "primary",
  size: "md",
});

const buttonClass = computed(() => {
  return [ui.size[props.size], ui[theme.value][props.type], ui.base].join(" ");
});

const ui = {
  base: "rounded-md cursor-pointer text-center transition-all duration-150 ease-in-out",
  size: {
    icon: "min-w-6 h-6 text-xs justify-center items-center flex",
    sm: "min-w-15 h-8 text-sm p-1",
    md: "min-w-20 h-10 text-md p-2",
    lg: "min-w-24 h-12 text-lg p-2",
  },
  light: {
    primary:
      "bg-lTheme-light text-lTheme-font hover:shadow-sm shadow-lTheme-accent",
  },
  dark: {
    primary:
      "bg-dTheme-surfaceOther text-dTheme-font hover:shadow-sm shadow-dTheme-accent",
  },
};
</script>

<style scoped lang=""></style>
