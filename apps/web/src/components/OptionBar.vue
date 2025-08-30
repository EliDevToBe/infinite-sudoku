<template>
  <div :class="ui.wrapper">
    <RadioUI
      value="easy"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Easy"
    />

    <RadioUI
      value="medium"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Medium"
    />

    <RadioUI
      value="hard"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Hard"
    />

    <RadioUI
      value="hardcore"
      radioGroup="difficulty"
      v-model="difficulty"
      label="Hardcore"
    />
  </div>
</template>

<script setup lang="ts">
import { type DifficultyOptions } from "@/utils";

const difficulty = defineModel<DifficultyOptions>();

const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md ",
    "w-[95%] max-w-150 p-1 pl-2 pr-2",
    "bg-dTheme-surfaceOther",
  ],
};
</script>

<style scoped></style>
