<template>
  <VueApp :toaster="toastConfig">
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
import type { ToasterProps } from "@nuxt/ui";

const toastConfig: ToasterProps = {
  position: window.innerWidth < 768 ? "top-center" : "top-right",
  ui: {
    base: "bg-[linear-gradient(to_bottom,rgba(50,71,83,1)_0%,rgba(32,47,55,1)_100%)]",
    viewport: "max-w-[300px] w-[75%]",
  },
  expand: false,
  duration: 2500,
  progress: false,
};
</script>
