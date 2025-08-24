<template>
  <input
    :type="type"
    :class="inputClass"
    class="inset"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    v-model="model"
    :style="hasError ? ui.hasError : ''"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from "vue";
import { useTheme } from "@/composables";

const { theme } = useTheme();

const model = defineModel<string>();

type Props = {
  variant?: "primary" | "secondary";
  size?: "icon" | "sm" | "md" | "lg";
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  autocomplete?: "on" | "off";
  hasError?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  type: "text",
  autocomplete: "off",
});

const errorClass = computed(() => {
  return props.hasError ? ui.hasError : "";
});

const inputClass = computed(() => {
  return [
    ui.base,
    ui.size[props.size],
    errorClass.value,
    props.disabled ? ui.disabled : ui[theme.value][props.variant],
  ].join(" ");
});

const ui = {
  base: "rounded-md cursor-pointer transition-all duration-150 ease-in-out p-2",
  disabled: "opacity-50 cursor-not-allowed bg-gray-400 text-gray-700",
  size: {
    icon: "min-w-6 h-6 text-xs justify-center items-center flex",
    sm: "min-w-15 h-6 text-xs",
    md: "min-w-20 h-10 text-md",
    lg: "min-w-24 h-12 text-lg",
  },
  light: {
    primary: `bg-lTheme-light text-lTheme-font `,
    secondary: `bg-dTheme-light text-lTheme-accent 
        outline-[1px] outline-lTheme-light outline-lTheme-font 
      md:hover:shadow-sm md:hover:shadow-lTheme-accent`,
  },
  dark: {
    primary: `bg-dTheme-surfaceOther text-dTheme-font `,
    secondary: `bg-dTheme-surfaceOther text-dTheme-font 
      md:hover:shadow-sm md:hover:shadow-dTheme-accent`,
  },
  hasError: "box-shadow: inset 1px -1px 5px var(--colors-lTheme-danger)",
};
</script>

<style scoped lang="css">
.inset {
  outline: none;
  box-shadow: inset 1px -1px 1px #2f3e46;
  transition: all 150 ease-in-out;
}

@media (hover: hover) {
  .inset:hover {
    box-shadow: inset 2px -1px 4px #228cdb;
    transition: all 150 ease-in-out;
  }
}

.inset:focus {
  box-shadow: inset 2px -1px 4px #228cdb;
  transition: all 150 ease-in-out;
}
</style>
