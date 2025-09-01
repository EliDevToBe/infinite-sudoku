<template>
  <div :class="ui.wrapper">
    <RadioUI
      value="easy"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Easy"
      @update:modelValue="emit('onSelect')"
    />

    <RadioUI
      value="medium"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Medium"
      @update:modelValue="emit('onSelect')"
    />

    <RadioUI
      value="hard"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Hard"
      @update:modelValue="emit('onSelect')"
    />

    <RadioUI
      value="hardcore"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Hardcore"
      @update:modelValue="emit('onSelect')"
    />
  </div>
</template>

<script setup lang="ts">
import { type DifficultyOptions } from "@/utils";

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
