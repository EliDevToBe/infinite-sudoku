<template>
  <SwitchUI v-model="checked" @update:modelValue="toggleTheme">
    {{ checked ? "🌙" : "☀️" }}
  </SwitchUI>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { ref } from "vue";
import SwitchUI from "./ui/SwitchUI.vue";

const { toggleTheme } = useTheme();
const checked = ref(false);
</script>
