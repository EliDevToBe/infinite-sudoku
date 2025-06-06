<template>
  <BaseLayout>
    <template #header>
      <h1>SudoKing</h1>
    </template>

    <MainWrapper>
      <RouterView />
    </MainWrapper>

    <template #footer> FOOTER </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import BaseLayout from "./components/BaseLayout.vue";
import MainWrapper from "./components/MainWrapper.vue";
</script>
