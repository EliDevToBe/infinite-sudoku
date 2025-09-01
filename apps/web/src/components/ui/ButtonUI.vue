<template>
  <button :class="buttonClass" :disabled="disabled || isLoading">
    <VueIcon
      v-if="leadingIcon"
      :name="leadingIcon"
      :width="ui.icon[size]"
      :height="ui.icon[size]"
    />
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
        :width="ui.icon[size]"
        :height="ui.icon[size]"
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

const ui = {
  base: [
    "gap-1 flex items-center justify-center cursor-pointer text-center box-border",
    "transition-all duration-150 ease-in-out",
    "shadow-xs shadow-black",
    "sm:hover:shadow-sm sm:hover:shadow-dTheme-accent",
  ],
  disabled: "opacity-50 cursor-not-allowed bg-gray-400 text-gray-700",
  size: {
    "icon-xs": "w-4 h-4 text-xs rounded-full",
    icon: "w-6 h-6 text-xs rounded-md ",
    sm: "min-w-15 max-w-fit h-8 text-xs p-1 rounded-md ",
    md: "min-w-20 max-w-fit h-10 text-md p-2 rounded-md",
    lg: "min-w-24 max-w-fit h-12 text-lg p-2 rounded-md",
  },
  light: {
    primary: `
       bg-lTheme-light text-lTheme-font
        active:bg-lTheme-surfaceOther`,
    secondary: `
        bg-lTheme-surfaceOther text-lTheme-accent
        outline-[1px] outline-lTheme-light outline-lTheme-font
      active:bg-lTheme-light`,
    danger: `
      bg-lTheme-danger text-lTheme-surface
        active:bg-lTheme-dangerOther`,
    ghost: ``,
  },
  dark: {
    primary: `
      bg-dTheme-surfaceOther text-dTheme-font
      active:bg-dTheme-surface active:text-dTheme-light`,
    secondary: [
      "text-dTheme-font active:text-dTheme-light",
      "bg-dTheme-surface active:bg-dTheme-surfaceOther",
    ],
    danger: `
      bg-dTheme-danger text-dTheme-font
      active:bg-dTheme-dangerOther active:text-dTheme-light`,
    ghost: `text-gray-500 outline-none sm:hover:bg-gray-500 sm:hover:bg-opacity-15 `,
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
