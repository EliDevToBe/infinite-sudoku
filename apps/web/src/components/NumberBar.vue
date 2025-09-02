<template>
  <div :class="ui.wrapper">
    <button
      :class="ui.icon"
      v-for="number in 9"
      :key="`Key-number-${number}`"
      @click="emit('onSelect', number)"
      :aria-label="`Select number ${number}`"
    >
      <VueIcon
        aria-hidden="true"
        :class="ui.icon"
        :name="`tabler:number-${number}-small`"
      ></VueIcon>
    </button>
  </div>
</template>

<script setup lang="ts">
const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md",
    "transition-all duration-200 ease-in-out",
    "w-68 sm:w-100 p-1 pl-2 pr-2",
    "bg-dTheme-surfaceOther",
  ],
  icon: ["w-7 h-7 sm:w-9 sm:h-9 ", "sm:hover:bg-dTheme-light/10 rounded-md"],
};

const emit = defineEmits<{
  onSelect: [value: number];
}>();
</script>

<style scoped></style>
