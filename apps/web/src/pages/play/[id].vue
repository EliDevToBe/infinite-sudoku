<template>
  <MainWrapper>
    <div>PLAY index</div>
  </MainWrapper>
</template>

<script setup lang="ts">
import { MainWrapper } from "@/components";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute("/play/[id]");

onMounted(() => {
  console.debug(route.params.id);
});
</script>

<style scoped lang=""></style>
