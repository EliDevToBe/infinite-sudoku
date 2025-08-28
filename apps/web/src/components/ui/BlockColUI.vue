<template>
  <div
    v-for="blockCol in 3"
    :key="`block-col-${blockCol}`"
    :class="ui.fullBlock"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const ui = {
  fullBlock: [
    "flex flex-col rounded-md overflow-hidden",
    "sm:m-0.25 max-sm:m-0.125",
    "border-1 border-dTheme-accent",
  ],
};
</script>

<style scoped lang=""></style>
