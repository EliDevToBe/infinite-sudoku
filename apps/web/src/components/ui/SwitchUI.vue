<template>
  <Switch
    v-model="checked"
    class="flex h-6 w-11 rounded-full pl-1"
    :class="{
      'bg-dTheme-surfaceLight border-2 border-dTheme-light': !checked,
      'bg-lTheme-surfaceDark border-2 border-lTheme-light': checked,
    }"
  >
    <div
      class="h-5 w-4 transform rounded-full transition justify-center items-center flex"
      :class="{ 'translate-x-5': checked }"
    >
      <span class="text-sm flex items-center h-4 w-4 rounded-full">
        <slot></slot>
      </span>
    </div>
  </Switch>
</template>

<script setup lang="ts">
import { Switch } from "@headlessui/vue";

const checked = defineModel<boolean>();
</script>
