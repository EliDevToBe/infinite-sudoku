<template>
  <SwitchUI v-model="isLightTheme" @update:modelValue="toggleTheme">
    {{ isLightTheme ? "☀️" : "🌙" }}
  </SwitchUI>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import SwitchUI from "./ui/SwitchUI.vue";

const { toggleTheme, isLightTheme } = useTheme();
</script>
