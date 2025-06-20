<template>
  <Switch
    v-model="checked"
    class="flex h-6 w-11 rounded-full pl-1"
    :class="{
      // 'bg-dTheme-surface border-2 border-dTheme-accent': !checked,
      // 'bg-lTheme-light border-2 border-lTheme-surface': checked,
    }"
  >
    <div
      class="inline-block h-5 w-4 transform rounded-full transition"
      :class="{ 'translate-x-5': checked }"
    >
      <span class="text-sm flex items-center">
        <slot></slot>
      </span>
    </div>
  </Switch>
</template>

<script setup lang="ts">
import { Switch } from "@headlessui/vue";

const checked = defineModel<boolean>();
</script>
