<template>
  <MainWrapper>
    <template #sub-header>
      <div class="bg-red-200">Test Slot #sub-header</div>
    </template>

    <MainContent class="h-max gap-5">
      <h1 class="text-3xl font-bold sticky top-0">DESIGN VIEW</h1>
      <div :class="ui.buttonWrapper">
        <ButtonUI>Button 1</ButtonUI>
        <ButtonUI>Button 2</ButtonUI>
        <ButtonUI>Button 3</ButtonUI>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { MainContent, MainWrapper } from "@/components";
import { ButtonUI } from "@/components/ui";
definePage({ meta: { requiresAuth: true, roles: ["admin"] } });

const ui = {
  buttonWrapper: "flex w-[50%] justify-between",
};
</script>

<style scoped lang=""></style>
