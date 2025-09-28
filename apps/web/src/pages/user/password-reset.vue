<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Password reset page</h1>
    <div>(check logs)</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const token = route.query.t;

onMounted(() => {
  console.log(token);
});
</script>

<style scoped lang=""></style>
