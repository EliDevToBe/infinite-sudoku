<template>
  <div :class="{ 'flex flex-row gap-2 items-center': horizontal }">
    <label :for="name" :class="labelClass">{{ label }}</label>
    <InputUI
      :size="size"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :name="name"
    />
  </div>
</template>

<script setup lang="ts">
import { InputUI } from "@/components/ui";
import { computed } from "vue";

type Props = {
  label?: string;
  name: string;
  type: "text" | "email" | "password" | "tel" | "url" | "search";
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  horizontal?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  placeholder: "",
  name: "",
});

const model = defineModel<string>();

const ui = {
  label: {
    sm: "text-xs text-lTheme-font block",
    md: "text-sm text-lTheme-font block",
    lg: "text-md text-lTheme-font block",
  },
};

const labelClass = computed(() => {
  return [ui.label[props.size as keyof typeof ui.label]].join(" ");
});
</script>
