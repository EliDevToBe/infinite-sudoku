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
  fullBlock:
    "flex flex-col sm:m-0.5 max-sm:m-0.25 border-1 border-dTheme-accent rounded-md overflow-hidden",
};
</script>

<style scoped lang=""></style>
