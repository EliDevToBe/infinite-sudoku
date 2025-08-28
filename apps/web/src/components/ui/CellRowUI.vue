<template>
  <div v-for="cellRow in 3" :key="`cell-row-${cellRow}`" :class="ui.cellRow">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const ui = { cellRow: "flex" };
</script>

<style scoped lang=""></style>
