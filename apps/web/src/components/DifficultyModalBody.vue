<template>
  <div>
    <span class="inline-block">
      Switching difficulty from
      <span class="font-bold text-green-500 text-lg">{{ oldDifficulty }}</span>
      to
      <span class="font-bold text-dTheme-accent text-lg">{{
        currentDifficulty
      }}</span>
      will reset your current sudoku.
    </span>
    <span class="inline-block"
      >You will <span class="text-red-500">lose</span> your progress.</span
    >
    <span class="inline-block mt-2"
      >You can
      <span class="text-amber-400">register</span>
      to auto save your sudoku.
    </span>
  </div>
</template>

<script setup lang="ts">
import type { DifficultyOptions } from "@/utils";

defineProps<{
  oldDifficulty: DifficultyOptions;
  currentDifficulty: DifficultyOptions;
}>();
</script>

<style scoped lang=""></style>
