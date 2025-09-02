<template>
  <div :class="ui.wrapper">
    <LazyTooltipUI text="Undo last move">
      <button
        tabindex="0"
        :class="undoClass"
        @click="() => canUndo && emit('onUndo')"
        :aria-label="`Undo last move`"
      >
        <VueIcon
          :class="undoClass"
          name="lucide:undo"
          alt="Undo action icon"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="undo-button" class="sr-only">Undo action</label>
    </LazyTooltipUI>

    <LazyTooltipUI text="Redo last move">
      <button
        tabindex="0"
        :class="redoClass"
        @click="() => canRedo && emit('onRedo')"
        aria-labelledby="redo"
        id="redo-button"
      >
        <VueIcon
          :class="redoClass"
          name="lucide:redo"
          alt="Redo action icon"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="redo-button" class="sr-only">Redo action</label>
    </LazyTooltipUI>

    <LazyTooltipUI :text="`Erase selected cell ${dataEraseTooltip}`">
      <button
        tabindex="0"
        :class="eraseClass"
        @click="handleEraser"
        :aria-label="`Erase selected cell ${dataEraseTooltip}`"
      >
        <VueIcon
          :class="eraseClass"
          name="lucide:eraser"
          alt="Eraser icon"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="erase-button" class="sr-only">Erase action</label>
    </LazyTooltipUI>

    <LazyTooltipUI text="Toggle Note mode">
      <button
        tabindex="0"
        :class="noteClass"
        @click="toggleNote"
        :aria-label="`Note mode ${isNoteMode ? 'enabled' : 'disabled'}`"
        :aria-pressed="isNoteMode"
      >
        <VueIcon
          :class="noteClass"
          name="lucide:pencil"
          alt="Note mode icon"
          aria-hidden="true"
        ></VueIcon>
      </button>
      <label for="note-button" class="sr-only">Note mode</label>
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
