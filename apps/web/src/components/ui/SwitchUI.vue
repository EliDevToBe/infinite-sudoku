<template>
  <Switch
    v-model="checked"
    class="flex h-6 w-11 rounded-full pl-[0.125rem]"
    :class="{
      'bg-dTheme-surfaceOther border-2 border-dTheme-light': !checked,
      'bg-lTheme-surfaceOther border-2 border-lTheme-light': checked,
    }"
  >
    <div
      class="h-5 w-4 transform rounded-full transition justify-center items-center flex"
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
