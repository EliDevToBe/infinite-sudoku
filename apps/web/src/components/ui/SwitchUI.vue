<template>
  <Switch
    v-model="checked"
    class="flex h-6 w-11 rounded-full pl-[0.125rem] shadow-xs shadow-lTheme-font hover:shadow-sm hover:shadow-lTheme-accent"
    :class="{
      'bg-dTheme-surfaceOther border-2 border-dTheme-light': !checked,
      'bg-lTheme-surfaceOther border-2 border-lTheme-light': checked,
    }"
  >
    <div
      class="h-5 w-4 transform rounded-full transition-all duration-300 ease-in-out justify-center items-center flex isolate"
      :class="{ 'translate-x-5': checked }"
    >
      <span
        class="text-sm flex items-center h-4 w-4 rounded-full justify-center"
        :class="{
          'bg-dTheme-surfaceOther': checked,
        }"
      >
        <slot></slot>
      </span>
    </div>
  </Switch>
</template>

<script setup lang="ts">
import { Switch } from "@headlessui/vue";

const checked = defineModel<boolean>({
  default: false,
});
</script>
