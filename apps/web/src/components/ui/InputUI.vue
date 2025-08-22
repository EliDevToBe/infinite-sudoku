<template>
  <div>
    <input
      :type="props.type"
      :class="inputClass"
      style="box-shadow: inset 5px -5px 5px red"
    />
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from "vue";
import { useTheme } from "@/composables";

const { theme } = useTheme();

type Props = {
  variant?: "primary" | "secondary";
  size?: "icon" | "sm" | "md" | "lg";
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  type: "text",
});

const inputClass = computed(() => {
  return [ui.size[props.size], ui[theme.value][props.variant], ui.base].join(
    " "
  );
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
      "bg-lTheme-light text-lTheme-font inset-shadow inset-shadow-xs inset-shadow-lTheme-font hover:inset-shadow-sm hover:inset-shadow-lTheme-accent",
    secondary:
      "bg-lTheme-surfaceOther text-lTheme-accent outline-[1px] outline-lTheme-light  outline-lTheme-font hover:shadow-sm hover:shadow-lTheme-accent",
  },
  dark: {
    primary:
      "bg-dTheme-surfaceOther text-dTheme-font inset-shadow-xs inset-shadow-dTheme-surface  hover:inset-shadow-sm hover:inset-shadow-dTheme-accent",
    secondary:
      "bg-dTheme-surfaceOther text-dTheme-font hover:shadow-sm hover:shadow-dTheme-accent",
  },
};
</script>

<style scoped lang="">
.test:hover {
  box-shadow: inset 5px -5px 10px 0 bg-cyan-500;
}
</style>
