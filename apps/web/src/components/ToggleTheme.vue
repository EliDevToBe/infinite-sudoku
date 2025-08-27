<template>
  <SwitchUI @update:modelValue="toggleTheme">
    {{ isLightTheme ? "☀️" : "🌙" }}
  </SwitchUI>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables";

const { toggleTheme, isLightTheme } = useTheme();
</script>
