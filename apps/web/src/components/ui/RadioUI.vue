<template>
  <div
    :class="[radioClass, model !== value ? 'inset' : '']"
    @click="model = value"
  >
    <input
      type="radio"
      :value="value"
      :name="radioGroup"
      appearance-none
      v-model="model"
      :checked="model === value"
      :id="value"
    />
    <label class="cursor-pointer" :for="value">{{ label }}</label>
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

<style scoped lang="css">
@media (hover: hover) {
  .inset:hover {
    box-shadow: inset 0px -1px 0px var(--colors-lTheme-accent);
    transition: all 150 ease-in-out;
  }
}
</style>
