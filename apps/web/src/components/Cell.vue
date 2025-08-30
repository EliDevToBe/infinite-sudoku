<template>
  <div :class="ui.cell">
    <input
      :disabled="!currentCell.isEditable"
      :class="inputClass"
      type="text"
      :value="displayValue"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import type { Cell } from "@/utils";
import { validateInput } from "@/utils";
import { computed } from "vue";

const props = defineProps<{
  currentCell: Cell;
  isLoading: boolean;
}>();

type Emits = {
  "update:cell": [value: number];
};
const emit = defineEmits<Emits>();

const inputValue = defineModel<number>({ required: true });

const displayValue = computed(() => {
  return inputValue.value === 0 ? "" : inputValue.value;
});

const ui = {
  cell: [
    "w-8 h-8 sm:w-12 sm:h-12",
    "bg-gray-300 text-dTheme-surface",
    "transition-all duration-200",
  ],
  input: [
    "cursor-default caret-transparent outline-none text-center w-full h-full",
    "sm:text-2xl text-lg",
    "focus:bg-dTheme-light",
  ],
  blur: "transition-all duration-200 blur-[2px] sm:blur-[3px] pointer-events-none",
  disabled: "font-600 text-dTheme-accentDarker",
};

const inputClass = computed(() => {
  return [
    ui.input,
    props.isLoading ? ui.blur : "",
    props.currentCell.isEditable ? "" : ui.disabled,
  ];
});

const handleInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  let input = inputElement.value.slice(-1);

  if (input === "") {
    inputValue.value = 0;
    emit("update:cell", 0);
    return;
  }

  if (!validateInput(input)) {
    inputElement.value = "";
    inputValue.value = 0;
    return;
  }

  inputElement.value = input;
  emit("update:cell", Number(input));
};
</script>
