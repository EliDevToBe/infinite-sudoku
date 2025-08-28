<template>
  <div
    v-for="blockRow in 3"
    :key="`block-row-${blockRow}`"
    :class="ui.blockRow"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const ui = { blockRow: "flex " };
</script>

<style scoped lang=""></style>
