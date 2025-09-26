<template>
  <VueDropdownMenu
    size="lg"
    :items="items"
    :content="{
      align: align ?? 'center',
      side: side ?? 'bottom',
      sideOffset: offset ?? 8,
    }"
    :ui="ui"
  >
    <slot></slot>
  </VueDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const items = defineModel<DropdownMenuItem[]>();
const props = defineProps<{
  offset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}>();

const ui = {
  content: [
    "bg-[linear-gradient(to_bottom,rgba(50,71,83,1)_0%,rgba(32,47,55,1)_100%)]  shadow-xs shadow-dTheme-accent",
    "border-t-1 border-t-dTheme-light",
    "border-l-1 border-l-dTheme-light/80 ",
    "border-r-1 border-r-dTheme-light/80",
  ],
  item: "group hover:bg-dTheme-light/20 rounded-md text-dTheme-font",
  itemLeadingIcon: "text-dTheme-light/80 group-hover:text-dTheme-accent",

  separator: "h-px bg-dTheme-light/30",
  group: "p-1 flex flex-col gap-1",
};
</script>

<style scoped lang=""></style>
