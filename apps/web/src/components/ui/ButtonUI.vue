<template>
  <button :class="buttonClass" :disabled="disabled || isLoading">
    <div>
      <VueIcon
        v-if="leadingIcon"
        :name="leadingIcon"
        :width="iconSize"
        :height="iconSize"
      />
    </div>
    <slot></slot>
    <Transition
      enter-active-class="transition-all duration-150 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <VueIcon
        v-if="isLoading"
        name="svg-spinners:ring-resize"
        :color="COLORS.lTheme.accent"
        :width="iconSize"
        :height="iconSize"
      />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "@/composables";
import { COLORS } from "@/utils/constants";

const { theme } = useTheme();

type Props = {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "icon-xs" | "icon" | "sm" | "md" | "lg";
  iconSize?: string;
  isLoading?: boolean;
  disabled?: boolean;
  leadingIcon?: string;
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
  ];
});

const iconSize = computed(() => {
  return props.iconSize || ui.icon[props.size];
});

const ui = {
  base: [
    "gap-1 flex items-center justify-center cursor-pointer text-center box-border",
    "transition-all duration-150 ease-in-out",
  ],
  disabled: "cursor-not-allowed bg-gray-400 text-gray-700",
  size: {
    "icon-xs": "w-4 h-4 text-xs rounded-full",
    icon: "w-6 h-6 text-xs rounded-md ",
    sm: "min-w-15 max-w-fit h-8 text-xs p-1 rounded-md ",
    md: "min-w-20 max-w-fit h-10 text-md p-2 rounded-lg",
    lg: "min-w-24 max-w-fit h-12 text-lg p-2 rounded-lg",
  },
  light: {
    primary: [
      "bg-lTheme-light text-lTheme-font",
      "active:bg-lTheme-surfaceOther",
      "shadow-xs shadow-gray-900",
      "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
    ],
    secondary: [
      "bg-lTheme-surfaceOther text-lTheme-accent ",
      "active:bg-lTheme-light",
      "outline-[1px] outline-lTheme-light outline-lTheme-font",
      "shadow-xs shadow-gray-900",
      "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
    ],
    danger: [
      "bg-lTheme-danger text-lTheme-surface",
      "active:bg-lTheme-dangerOther",
      "shadow-xs shadow-gray-900",
      "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
    ],
    ghost: ``,
  },
  dark: {
    primary: [
      "bg-dTheme-surfaceOther text-dTheme-font",
      "active:bg-dTheme-surface active:text-dTheme-light",
      "shadow-xs shadow-gray-900",
      "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
    ],
    secondary: [
      "text-dTheme-font active:text-dTheme-light",
      "bg-dTheme-surface active:bg-dTheme-surfaceOther",
      "shadow-xs shadow-gray-900",
      "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
    ],
    danger: [
      "bg-dTheme-danger text-dTheme-font",
      "active:bg-dTheme-dangerOther active:text-dTheme-light",
      "shadow-xs shadow-gray-900",
      "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
    ],
    // ghost: [
    //   "bg-gray-500 text-gray-700 outline-none shadow-none",
    //   " sm:hover:bg-gray-600 sm:hover:shadow-none sm:hover:text-gray-400",
    // ],
    ghost: [
      "bg-transparent text-dTheme-font border-none border-dTheme-surfaceOther outline-none shadow-none",
      "sm:hover:bg-dTheme-light/10 sm:hover:border-dTheme-accent sm:hover:text-dTheme-font",
      "disabled:bg-transparent disabled:text-dTheme-light disabled:border-dTheme-light/50 disabled:cursor-not-allowed",
    ],
  },
  icon: {
    "icon-xs": "8",
    icon: "16",
    sm: "16",
    md: "20",
    lg: "24",
  },
};
</script>

<style scoped lang="css"></style>
