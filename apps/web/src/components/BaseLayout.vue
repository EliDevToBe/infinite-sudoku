<template>
  <div
    class="w-screen h-screen-mobile md:h-screen flex flex-col overflow-auto"
    :class="{
      'bg-[linear-gradient(to_bottom,rgba(245,246,244,1)_0%,rgba(214,218,210,1)_100%)] ':
        isLightTheme,
      'dTheme-gradientBackground': !isLightTheme,
    }"
  >
    <header class="flex justify-center items-center">
      <slot name="header"></slot>
    </header>

    <main class="grow-1">
      <slot></slot>
    </main>

    <footer class="sticky bottom-0 flex flex-col items-center justify-center">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables";

const { isLightTheme } = useTheme();

const ui = {
  test: "bg-[linear-gradient(to_bottom,rgba(65,86,98,1)_0%,rgba(47,62,70,1)_100%)]",
  test2: "dTheme-gradientBackground",
};
</script>
