<template>
  <div v-for="cellCol in 3" :key="`cell-col-${cellCol}`" :class="ui.cellCol">
    <!-- Actual CELL -->
    <div :class="ui.cell">
      <input
        class="outline-none text-center text-lg w-full h-full"
        type="text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const ui = {
  cellCol: "flex flex-col border-1 border-green-500",
  cell: "bg-blue-500 w-8 h-8 sm:w-12 sm:h-12 transition-all duration-200",
};
</script>

<style scoped lang=""></style>
