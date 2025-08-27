<template>
  <div :class="{ 'flex flex-row gap-2 items-center': horizontal }">
    <label :for="name" :class="labelClass"
      >{{ label
      }}<span class="text-lTheme-danger">
        {{ props.required ? "*" : "" }}
      </span>
    </label>
    <InputUI
      :id="name"
      :size="size"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :hasError="hasError"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  label?: string;
  name: string;
  type: "text" | "email" | "password" | "tel" | "url" | "search";
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  horizontal?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  required?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  placeholder: "",
  name: "",
});

const inputValue = defineModel<string>();

const ui = {
  label: {
    sm: "text-xs text-black block",
    md: "text-sm text-black block",
    lg: "text-md text-black block",
  },
};

const labelClass = computed(() => {
  return [ui.label[props.size as keyof typeof ui.label]].join(" ");
});
</script>
