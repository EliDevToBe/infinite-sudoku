<template>
  <div :class="ui.wrapper">
    <div role="button" :class="ui.icon" @click="emit('onUndo')">
      <VueIcon role="button" :class="ui.icon" name="lucide:undo"></VueIcon>
    </div>

    <div role="button" :class="ui.icon" @click="emit('onRedo')">
      <VueIcon role="button" :class="ui.icon" name="lucide:redo"></VueIcon>
    </div>

    <div role="button" :class="ui.icon" @click="handleEraser">
      <VueIcon role="button" :class="ui.icon" name="lucide:eraser"></VueIcon>
    </div>

    <div role="button" :class="ui.icon" @click="emit('onNote')">
      <VueIcon role="button" :class="ui.icon" name="lucide:pencil"></VueIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from "@/composables";

const { getSelectedCell } = useState();

const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md",
    "transition-all duration-200 ease-in-out",
    "w-[95%] w-50 sm:w-75 p-1 pl-2 pr-2",
    "bg-dTheme-surfaceOther",
  ],
  icon: ["w-5 h-5 sm:w-7 sm:h-7 ", "sm:hover:bg-dTheme-light/20 rounded-md"],
};

const emit = defineEmits<{
  onUndo: [];
  onRedo: [];
  onEraser: [{ x: number; y: number }];
  onNote: [];
}>();

const handleEraser = () => {
  const selectedCell = getSelectedCell();
  if (!selectedCell) return;
  emit("onEraser", selectedCell);
};
</script>

<style scoped></style>
