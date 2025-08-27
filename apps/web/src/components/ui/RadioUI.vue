<template>
  <div :class="radioClass" @click="model = value">
    <input
      type="radio"
      :value="value"
      :name="radioGroup"
      appearance-none
      v-model="model"
      :checked="model === value"
      :id="value"
    />
    <label :for="value">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  value: string;
  radioGroup: string;
  label: string;
};

const props = withDefaults(defineProps<Props>(), {});
const model = defineModel<string>();

const ui = {
  base: "flex grow box-border p-1 justify-center cursor-pointer",
  active: "bg-dTheme-surface rounded-md",
};

const radioClass = computed(() => {
  return [ui.base, model.value === props.value ? ui.active : ""];
});
</script>
