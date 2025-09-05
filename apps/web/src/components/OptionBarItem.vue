<template>
  <RadioUI
    :value="value"
    :radioGroup="group"
    v-model="difficulty"
    :label="labelMap[value]"
  >
    <template #trailingSlot>
      <span
        class="text-[11px] text-dTheme-light/80 flex justify-center items-center gap-1"
        v-if="completionRate > 0"
      >
        <VueIcon name="lucide:puzzle"></VueIcon>
        {{ completionRate }}%</span
      >
    </template>
  </RadioUI>
</template>

<script setup lang="ts">
import { calculateCompletionRate, type DifficultyOptions } from "@/utils";
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

  return calculateCompletionRate(save);
});
</script>
