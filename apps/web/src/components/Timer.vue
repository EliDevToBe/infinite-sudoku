<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-500 ease-in-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isAuthenticated"
      class="flex px-5 justify-center w-full absolute -translate-y-5 pointer-events-none"
    >
      <span class="text-dTheme-font text-sm">{{ timerDisplay }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useTimer } from "@/composables";
import type { Cell, DifficultyOptions } from "@shared/utils/sudoku/helper";
import { useAuth } from "@/composables";

const props = defineProps<{
  difficulty: DifficultyOptions;
  grid: Cell[][];
}>();

const { timerDisplay } = useTimer();
const { isAuthenticated } = useAuth();
</script>

<style scoped lang=""></style>
