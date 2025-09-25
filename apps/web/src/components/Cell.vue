<template>
  <div :class="ui.cell" @click="modularSelectCell">
    <input
      :id="`cell-${currentCell.x}x-${currentCell.y}y`"
      :disabled="!currentCell.isEditable"
      :class="[inputClass, currentCell.isEditable ? '' : 'pointer-events-none']"
      type="text"
      :value="displayValue"
      @input="handleInput"
      @focus="modularSelectCell"
      @beforeinput="handleBeforeInput"
      v-bind:class="{ [backgroundSelectedClass]: isSelected }"
      autocomplete="off"
      inputmode="none"
    />
    <label :for="`cell-${currentCell.x}x-${currentCell.y}y`" class="sr-only"
      >number {{ currentCell.value }}</label
    >
  </div>
</template>

<script setup lang="ts">
import type { Cell } from "@shared/utils/sudoku/helper";
import { validateInput } from "@/utils";
import { computed, ref } from "vue";
import { useState, useTimer, useMoveStack } from "@/composables";
import { throwFrontError } from "@/utils/error";

const { setSelectedCell, getSelectedCell } = useState();
const { pushMove } = useMoveStack();
const { startTimer } = useTimer();

const props = defineProps<{
  currentCell: Cell;
  isLoading: boolean;
  isSelected: boolean;
}>();

type Emits = {
  "update:cell": [value: number];
};
const emit = defineEmits<Emits>();

const inputValue = defineModel<number>({ required: true });

const displayValue = computed(() => {
  return inputValue.value === 0 ? "" : inputValue.value;
});

const backgroundSelectedClass = computed(() => {
  return props.currentCell.isEditable
    ? "bg-dTheme-accent/50"
    : "bg-dTheme-accent/40";
});

const ui = {
  cell: [
    "w-9 h-9 sm:w-12 sm:h-12",
    "bg-gray-300 text-dTheme-surface",
    "transition-all duration-200",
  ],
  input: [
    "cursor-default caret-transparent outline-none text-center w-full h-full",
    "sm:text-2xl text-lg",
  ],
  blur: "transition-all duration-200 blur-[2px] sm:blur-[3px] pointer-events-none",
  disabled: "font-semibold text-dTheme-accentDarker",
};

const inputClass = computed(() => {
  return [
    ui.input,
    props.isLoading ? ui.blur : "",
    props.currentCell.isEditable ? "" : ui.disabled,
  ];
});

const cellBeforeUpdate = ref<Cell>();

const handleBeforeInput = () => {
  cellBeforeUpdate.value = { ...props.currentCell };
};

const handleInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  let input = inputElement.value.slice(-1);

  if (!cellBeforeUpdate.value) {
    throwFrontError("Cell before update is not set", {
      cellBeforeUpdate: cellBeforeUpdate.value,
    });
    return;
  }

  if (input === "") {
    inputElement.value = "";
    inputValue.value = 0;

    const newCell = { ...cellBeforeUpdate.value, value: 0 };
    if (newCell.value !== cellBeforeUpdate.value.value) {
      pushMove(cellBeforeUpdate.value, newCell);
      setSelectedCell(newCell);
    }

    startTimer();

    emit("update:cell", 0);
    return;
  }

  if (!validateInput(input)) {
    inputElement.value = cellBeforeUpdate.value.value
      ? cellBeforeUpdate.value.value.toString()
      : "";
    inputValue.value = cellBeforeUpdate.value.value;
    return;
  }

  const newCell = { ...cellBeforeUpdate.value, value: Number(input) };
  if (newCell.value !== cellBeforeUpdate.value.value) {
    pushMove(cellBeforeUpdate.value, newCell);
    setSelectedCell(newCell);
  }

  startTimer();

  inputElement.value = input;
  emit("update:cell", Number(input));
};

const modularSelectCell = () => {
  const inMemoryCell = getSelectedCell();
  if (
    props.currentCell.x !== inMemoryCell?.x ||
    props.currentCell.y !== inMemoryCell?.y
  ) {
    setSelectedCell(props.currentCell);
  }
};
</script>
