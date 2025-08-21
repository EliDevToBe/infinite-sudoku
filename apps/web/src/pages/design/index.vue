<template>
  <MainWrapper> DESIGN VIEW </MainWrapper>
</template>

<script setup lang="ts">
import { MainWrapper } from "@/components";
definePage({ meta: { requiresAuth: true, roles: ["admin"] } });
</script>

<style scoped lang=""></style>
