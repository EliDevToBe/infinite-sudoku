<template>
  <div :class="ui.wrapper">
    <LazyTooltipUI text="Undo last move">
      <button
        :class="undoClass"
        @click="() => canUndo && emit('onUndo')"
        :aria-label="`Undo last move`"
        :disabled="!canUndo"
        id="undo-button"
      >
        <VueIcon
          :class="undoClass"
          name="lucide:undo"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="undo-button" class="sr-only">Undo action</label>
    </LazyTooltipUI>

    <LazyTooltipUI text="Redo last move">
      <button
        :class="redoClass"
        @click="() => canRedo && emit('onRedo')"
        aria-label="Redo last move"
        :disabled="!canRedo"
        id="redo-button"
      >
        <VueIcon
          :class="redoClass"
          name="lucide:redo"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="redo-button" class="sr-only">Redo action</label>
    </LazyTooltipUI>

    <LazyTooltipUI :text="`Erase selected cell ${dataEraseTooltip}`">
      <button
        :class="[ui.icon, ui.active]"
        @click="handleEraser"
        :aria-label="`Erase selected cell ${dataEraseTooltip}`"
        id="erase-button"
      >
        <VueIcon
          :class="[ui.icon, ui.active]"
          name="lucide:eraser"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="erase-button" class="sr-only">Erase action</label>
    </LazyTooltipUI>

    <LazyTooltipUI text="Toggle Note mode">
      <button
        :class="noteClass"
        @click="toggleNote"
        :aria-label="`Note mode ${isNoteMode ? 'enabled' : 'disabled'}`"
        :aria-pressed="isNoteMode"
        id="note-button"
      >
        <VueIcon
          :class="noteClass"
          :name="noteModeIcon"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="note-button" class="sr-only">Note mode</label>
    </LazyTooltipUI>

    <LazyTooltipUI text="New sudoku">
      <button
        :class="[ui.icon, ui.active]"
        :aria-label="`New sudoku`"
        id="new-sudoku-button"
        @click="handleNewSudoku"
      >
        <VueIcon
          :class="[ui.icon, ui.active, animateSpin]"
          name="lucide:refresh-cw"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="new-sudoku-button" class="sr-only">New sudoku</label>
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
    "flex items-center justify-between rounded-t-md",
    "transition-all duration-200 ease-in-out",
    "w-60 sm:w-75 p-1 pl-2 pr-2",
    "bg-dTheme-surfaceOther",
  ],
  icon: ["w-6 h-6 sm:w-7 sm:h-7 rounded-md", "sm:hover:bg-dTheme-light/10"],
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
  onNewSudoku: [];
}>();

const isNoteMode = ref<boolean>(false);
const isRefreshingGrid = ref<boolean>(false);

const undoClass = computed(() => {
  return [ui.icon, ui.active, canUndo.value ? ui.hasMove : ui.noMove];
});
const redoClass = computed(() => {
  return [ui.icon, ui.active, canRedo.value ? ui.hasMove : ui.noMove];
});
const noteClass = computed(() => {
  return [ui.icon, ui.active, isNoteMode.value ? ui.toggle : ""];
});

const dataEraseTooltip = computed(() => {
  const selectedCell = getSelectedCell();
  if (!selectedCell) return "";
  return `(${selectedCell?.x}, ${selectedCell?.y})`;
});

const animateSpin = computed(() => {
  return isRefreshingGrid.value
    ? "animate-spin animate-count-1 animate-duration-300"
    : "";
});

const noteModeIcon = computed(() => {
  return isNoteMode.value ? "lucide:pencil-line" : "lucide:pencil";
});

const handleEraser = () => {
  const selectedCell = getSelectedCell();

  if (!selectedCell || selectedCell.value === 0 || !selectedCell.isEditable) {
    return;
  }
  emit("onEraser", selectedCell);
};

const toggleNote = () => {
  // isNoteMode.value = !isNoteMode.value;
  emit("onNote", isNoteMode.value);
};

const handleNewSudoku = () => {
  isRefreshingGrid.value = true;
  emit("onNewSudoku");

  setTimeout(() => {
    isRefreshingGrid.value = false;
  }, 300);
};
</script>

<style scoped></style>
