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
      <div role="button" :class="eraseClass" @click="handleEraser">
        <VueIcon
          role="button"
          :class="eraseClass"
          name="lucide:eraser"
        ></VueIcon>
      </div>
    </LazyTooltipUI>

    <LazyTooltipUI text="Toggle Note mode">
      <div role="button" :class="noteClass" @click="toggleNote">
        <VueIcon
          role="button"
          :class="noteClass"
          name="lucide:pencil"
        ></VueIcon>
      </div>
    </LazyTooltipUI>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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
  active: "active:text-dTheme-accent",
  toggle: "text-green-500",
  noMove: "text-gray-500",
  hasMove: "sm:hover:bg-dTheme-light/10",
};

const emit = defineEmits<{
  onUndo: [];
  onRedo: [];
  onEraser: [{ x: number; y: number }];
  onNote: [boolean];
}>();

const isNoteMode = ref<boolean>(false);

const undoClass = computed(() => {
  return [ui.icon, ui.active, canUndo.value ? ui.hasMove : ui.noMove];
});
const redoClass = computed(() => {
  return [ui.icon, ui.active, canRedo.value ? ui.hasMove : ui.noMove];
});
const eraseClass = computed(() => {
  return [ui.icon, ui.active];
});
const noteClass = computed(() => {
  return [ui.icon, ui.active, isNoteMode.value ? ui.toggle : ""];
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

const toggleNote = () => {
  // isNoteMode.value = !isNoteMode.value;
  emit("onNote", isNoteMode.value);
};
</script>

<style scoped></style>
