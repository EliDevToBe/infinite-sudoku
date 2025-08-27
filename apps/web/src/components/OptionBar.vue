<template>
  <div
    class="flex w-[95%] max-w-150 items-center justify-between bg-dTheme-surfaceOther rounded-md p-1 pl-2 pr-2"
  >
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
import { ref } from "vue";

const difficulty = ref<string>("medium");
</script>

<style scoped></style>
