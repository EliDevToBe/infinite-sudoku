<template>
  <RadioUI
    :value="value"
    :radioGroup="group"
    v-model="difficulty"
    :label="labelMap[value]"
  >
    <template #trailingSlot v-if="isAuthenticated">
      <Transition
        enter-active-class="transition-all duration-500 ease-in-out"
        enter-from-class="opacity-0 -translate-y-3 scale-50"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-500 ease-in-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 -translate-y-3 scale-50"
      >
        <span
          class="line-height-[11px] text-[11px] text-dTheme-light/80 flex justify-center items-center gap-1"
          v-if="completionRate > 0"
        >
          <VueIcon name="lucide:puzzle"></VueIcon>
          {{ completionRate }}%</span
        >
      </Transition>
    </template>
  </RadioUI>
</template>

<script setup lang="ts">
import { calculateCompletionRate } from "@/utils";
import type { DifficultyOptions } from "@shared/utils/sudoku/helper";
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useState } from "@/composables/useState";

const difficulty = defineModel<DifficultyOptions>();

const props = defineProps<{
  value: DifficultyOptions;
  group: string;
}>();

const labelMap: Record<DifficultyOptions, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  hardcore: "Hardcore",
};

const { isAuthenticated } = useAuth();
const { getSudokuSave } = useState();

const completionRate = computed(() => {
  if (!isAuthenticated.value) return 0;

  const save = getSudokuSave(props.value);
  if (!save) return 0;

  return calculateCompletionRate(save.value);
});
</script>
