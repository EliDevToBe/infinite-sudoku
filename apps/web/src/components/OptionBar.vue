<template>
  <div :class="ui.wrapper">
    <OptionBarItem
      group="difficulty"
      v-model="difficulty"
      value="easy"
      @update:modelValue="emit('onSelect')"
    />

    <OptionBarItem
      group="difficulty"
      v-model="difficulty"
      value="medium"
      @update:modelValue="emit('onSelect')"
    />

    <OptionBarItem
      group="difficulty"
      v-model="difficulty"
      value="hard"
      @update:modelValue="emit('onSelect')"
    />

    <OptionBarItem
      group="difficulty"
      v-model="difficulty"
      value="hardcore"
      @update:modelValue="emit('onSelect')"
    />
  </div>
</template>

<script setup lang="ts">
import { type DifficultyOptions } from "@/utils";
import OptionBarItem from "./OptionBarItem.vue";

const difficulty = defineModel<DifficultyOptions>();

const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md ",
    "transition-all duration-200 ease-in-out",
    "w-95 sm:w-150 p-1 pl-2 pr-2 mx-2",
    "bg-dTheme-surfaceOther",
  ],
};

const emit = defineEmits<{
  onSelect: [];
}>();
</script>

<style scoped></style>
