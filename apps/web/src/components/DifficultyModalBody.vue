<template>
  <div>
    <span class="inline-block">
      Switching difficulty from
      <span class="font-bold text-green-500 text-lg">{{ oldDifficulty }}</span>
      to
      <span class="font-bold text-dTheme-accent text-lg">{{
        currentDifficulty
      }}</span>
      will reset your current grid.
    </span>
    <span class="inline-block">You will lose your progress.</span>
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
