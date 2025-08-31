<template>
  <VueTooltip :text="text" :delay-duration="500" :content="options">
    <slot></slot>
  </VueTooltip>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  options?: {
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
    sideOffset?: number;
  };
}>();
</script>
