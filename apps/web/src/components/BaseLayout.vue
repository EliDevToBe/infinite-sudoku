<template>
  <div
    class="w-screen h-screen flex flex-col property-transition duration-300 ease-in-out"
    :class="{
      'bg-lTheme-surface text-lTheme-font': isLightTheme,
      'bg-dTheme-surface text-dTheme-font': !isLightTheme,
    }"
  >
    <header class="flex justify-center items-center">
      <slot name="header"></slot>
    </header>
    <main class="grow-1">
      <slot></slot>
    </main>
    <footer class="sticky bottom-0">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { isLightTheme } = useTheme();
</script>
