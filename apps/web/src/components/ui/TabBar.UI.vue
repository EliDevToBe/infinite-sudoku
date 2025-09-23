<template>
  <div :class="ui.wrapper">
    <RadioUI
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
      :radioGroup="radioGroup"
      v-model="model"
    >
      <template #leadingSlot>
        <VueIcon :name="tab.icon" :width="ui.iconSize" :height="ui.iconSize" />
      </template>
    </RadioUI>
  </div>
</template>

<script setup lang="ts">
import RadioUI from "./RadioUI.vue";

export type Tab = {
  value: string;
  label: string;
  icon: string;
};

const props = defineProps<{
  tabs: Tab[];
  radioGroup: string;
}>();

const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md h-fit",
    "transition-all duration-200 ease-in-out",
    "w-full p-1 ",
    "bg-dTheme-surfaceOther",
  ],
  iconSize: "16",
};

const model = defineModel<string>();
</script>
