<template>
  <div class="flex flex-col">
    <span
      v-for="(error, index) in sortedErrors"
      :key="error.field + error.type"
      :style="{ opacity: (100 - 15 * index) / 100 }"
      :class="ui.errorTextClass"
      >{{ error.message }}</span
    >

    <span
      v-if="errors.length > 2"
      style="opacity: 45%"
      :class="ui.errorTextClass"
    >
      {{ `+${errors.length - 1} more` }}</span
    >
  </div>
</template>

<script setup lang="ts">
import type { FormError } from "@/composables/useForm";

const props = defineProps<{
  sortedErrors: FormError[];
  errors: FormError[];
}>();

const ui = {
  errorTextClass: "text-lTheme-danger text-[9px] sm:text-[11px] text-center",
};
</script>

<style scoped lang=""></style>
