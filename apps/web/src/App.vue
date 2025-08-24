<template>
  <VueApp>
    <BaseLayout>
      <template #header>
        <MainTitle />
      </template>

      <MainWrapper>
        <RouterView />
      </MainWrapper>

      <template #footer> FOOTER </template>
    </BaseLayout>
  </VueApp>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import BaseLayout from "./components/BaseLayout.vue";
import MainTitle from "./components/MainTitle.vue";
import MainWrapper from "./components/MainWrapper.vue";
</script>
