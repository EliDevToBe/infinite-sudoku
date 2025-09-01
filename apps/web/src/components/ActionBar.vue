<template>
  <div :class="ui.wrapper">
    <LazyTooltipUI text="Undo last move">
      <div
        role="button"
        :class="undoClass"
        @click="() => canUndo && emit('onUndo')"
      >
        <VueIcon role="button" :class="undoClass" name="lucide:undo"></VueIcon>
      </div>
    </LazyTooltipUI>

    <LazyTooltipUI text="Redo last move">
      <div
        role="button"
        :class="redoClass"
        @click="() => canRedo && emit('onRedo')"
      >
        <VueIcon role="button" :class="redoClass" name="lucide:redo"></VueIcon>
      </div>
    </LazyTooltipUI>

    <LazyTooltipUI :text="`Erase selected cell ${dataEraseTooltip}`">
      <div role="button" :class="ui.icon" @click="handleEraser">
        <VueIcon role="button" :class="ui.icon" name="lucide:eraser"></VueIcon>
      </div>
    </LazyTooltipUI>

    <LazyTooltipUI text="Toggle Note mode">
      <div role="button" :class="ui.icon" @click="emit('onNote')">
        <VueIcon role="button" :class="ui.icon" name="lucide:pencil"></VueIcon>
      </div>
    </LazyTooltipUI>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useState } from "@/composables";
import { useMoveStack } from "@/composables";
import { LazyTooltipUI } from "@/components";

const { getSelectedCell } = useState();
const { canUndo, canRedo } = useMoveStack();

const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md",
    "transition-all duration-200 ease-in-out",
    "w-50 sm:w-75 p-1 pl-2 pr-2",
    "bg-dTheme-surfaceOther",
  ],
  icon: ["w-5 h-5 sm:w-7 sm:h-7 rounded-md"],
  noMove: "text-gray-500",
  hasMove: "sm:hover:bg-dTheme-light/10",
};

const emit = defineEmits<{
  onUndo: [];
  onRedo: [];
  onEraser: [{ x: number; y: number }];
  onNote: [];
}>();

const undoClass = computed(() => {
  return [ui.icon, canUndo.value ? ui.hasMove : ui.noMove];
});
const redoClass = computed(() => {
  return [ui.icon, canRedo.value ? ui.hasMove : ui.noMove];
});

const dataEraseTooltip = computed(() => {
  const selectedCell = getSelectedCell();
  if (!selectedCell) return "";
  return `(${selectedCell?.x}, ${selectedCell?.y})`;
});

const handleEraser = () => {
  const selectedCell = getSelectedCell();
  if (!selectedCell) return;
  emit("onEraser", selectedCell);
};
</script>

<style scoped></style>
